const OpenAI = require('openai');
const storage = require('./storage');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const aiAgent = {
  // Analyze goal and create a plan
  analyzeGoal: async (goalText, durationDays) => {
    const prompt = `User wants to: "${goalText}" within ${durationDays} days.

Create a structured learning/execution plan with:
1. Main milestones for each week
2. Daily tasks (${durationDays} tasks total)
3. Success metrics
4. Potential challenges
5. Motivational approach

Return as JSON with this structure:
{
  "milestones": ["milestone 1", "milestone 2"],
  "dailyTasks": [{"day": 1, "title": "...", "description": "..."}],
  "successMetrics": ["metric 1", "metric 2"],
  "challenges": ["challenge 1"],
  "motivationalApproach": "..."
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert personal productivity coach and learning specialist. Create actionable, structured plans.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    try {
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return {
        dailyTasks: generateDefaultPlan(durationDays),
        milestones: ['Phase 1: Fundamentals', 'Phase 2: Practice', 'Phase 3: Mastery'],
        successMetrics: ['Complete all daily tasks', 'Understand core concepts', 'Build portfolio project'],
      };
    }
  },

  // Evaluate progress and generate feedback
  evaluateProgress: async (goal, completedTasks, totalTasks, days) => {
    const completionRate = ((completedTasks / totalTasks) * 100).toFixed(1);
    const daysElapsed = days;
    const expectedRate = (daysElapsed / goal.durationDays) * 100;
    const onTrack = completionRate >= expectedRate - 10;

    const prompt = `Learning Goal: "${goal.title}"
Duration: ${goal.durationDays} days
Days Elapsed: ${daysElapsed}
Tasks Completed: ${completedTasks}/${totalTasks} (${completionRate}%)
Expected Progress: ${expectedRate.toFixed(1)}%
Status: ${onTrack ? 'ON TRACK' : 'BEHIND'}

Generate:
1. Performance analysis
2. Specific encouragement or gentle nudge
3. Recommend next action (just 1-2 lines)
4. Weekly tips

Return as JSON:
{
  "analysis": "...",
  "encouragement": "...",
  "nextAction": "...",
  "tip": "..."
}`;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a supportive and smart productivity coach. Be encouraging but honest. Adapt your tone based on progress.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Error in evaluateProgress:', e);
      return {
        analysis: `You've completed ${completionRate}% of your tasks.`,
        encouragement: 'Keep going! Every step counts.',
        nextAction: 'Review today\'s task and complete it step by step.',
        tip: 'Break complex tasks into smaller subtasks.',
      };
    }
  },

  // Generate reminder message
  generateReminder: async (goal, lastCompletedDay) => {
    const daysSinceProgress = Math.floor((Date.now() - lastCompletedDay) / (1000 * 60 * 60 * 24));

    const prompt = `User is learning: "${goal.title}"
Days since last task completion: ${daysSinceProgress}

Generate a personalized reminder message that:
1. Acknowledges the hiatus positively
2. Motivates them to continue
3. Makes it easy to get back (1 simple next step)
4. Is warm but not judgmental

Keep it to 2-3 sentences.`;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a caring and non-judgmental productivity buddy.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (e) {
      console.error('Error in generateReminder:', e);
      return `Hey! It's been ${daysSinceProgress} days. Let's get back on track with one small task today. You've got this! 💪`;
    }
  },

  // Generate weekly report
  generateWeeklyReport: async (goal, week, tasksCompleted, totalWeekTasks) => {
    const weekProgress = ((tasksCompleted / totalWeekTasks) * 100).toFixed(1);

    const prompt = `Weekly Progress Report
Goal: "${goal.title}"
Week: ${week}
Progress: ${tasksCompleted}/${totalWeekTasks} tasks (${weekProgress}%)

Generate a brief, motivating weekly summary with:
1. What went well
2. One area to improve
3. Preview of next week
4. Overall morale boost

Keep it encouraging and actionable.`;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an experienced coach generating weekly progress reports. Be honest but uplifting.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (e) {
      console.error('Error in generateWeeklyReport:', e);
      return `Great work this week! You completed ${weekProgress}% of your tasks. Keep the momentum going! 🚀`;
    }
  },
};

// Default plan generator (fallback)
function generateDefaultPlan(days) {
  const tasks = [];
  for (let i = 1; i <= days; i++) {
    const phase = i <= Math.ceil(days / 3) ? 'Foundation' : i <= Math.ceil((2 * days) / 3) ? 'Practice' : 'Mastery';
    tasks.push({
      day: i,
      title: `${phase} - Day ${i}`,
      description: `Complete today's learning objective for phase: ${phase}`,
    });
  }
  return tasks;
}

module.exports = aiAgent;
