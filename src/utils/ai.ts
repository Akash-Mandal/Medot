export const generateSequenceWithAI = async (apiKey: string, model: string, prompt: string) => {
  if (!apiKey) throw new Error("API Key is required");

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert meditation guide. The user will ask for a meditation sequence. You must respond with ONLY a valid JSON object matching this structure: { \"phases\": [ { \"id\": \"unique_string\", \"name\": \"Phase Name\", \"duration\": duration_in_seconds_number } ] }. Do not include markdown blocks or any other text."
        },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate sequence');
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Invalid response format from AI', { cause: e });
  }
};
