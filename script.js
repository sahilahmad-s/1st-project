const form = document.getElementById('promptForm');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiKey = document.getElementById('apikey').value.trim();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!apiKey || !category || !description) {
    output.textContent = "❌ Please fill in all fields, including the API key.";
    return;
  }

  output.textContent = "⏳ Generating prompt... Please wait...";

  const finalPrompt = `
Based on the following, generate a complete, professional-quality AI prompt that users can copy and use in Gemini or ChatGPT. Only output the final prompt — do not add any explanation.

---
You are a skilled and experienced ${category}. I want to ${description}. Please structure the task using best practices. Make the prompt clean, copyable, and helpful. If any essential parts are missing, include suggestions. Format clearly and concisely.
`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: finalPrompt
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      output.textContent = reply;
    } else {
      output.textContent = "⚠️ Gemini did not return a usable result.";
    }
  } catch (err) {
    console.error(err);
    output.textContent = "❌ Network error or CORS issue. Use backend proxy if needed.";
  }
});

// Copy prompt to clipboard
copyBtn.addEventListener('click', () => {
  const text = output.textContent;
  if (text && text !== 'Your final AI prompt will appear here...') {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Prompt copied to clipboard!');
    });
  }
});
