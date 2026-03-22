const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

// Debug: check if API key is loaded
// if (!openRouterApiKey) {
//   throw new Error(
//     "OpenRouter API key is missing! Make sure OPENROUTER_APIKEY is set in your .env file and dotenv is loaded.",
//   );
// }

const model = "deepseek/deepseek-chat";

export const genereateResponse = async (prompt) => {
  const openRouterApiKey = process.env.OPENROUTER_APIKEY;
  const res = await fetch(openRouterUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openRouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You must return ONLY valid raw JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 4000,
      
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await res.json();
  // console.log("AI RESPONSE:", data);
  return data.choices[0].message.content;
};
