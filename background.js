chrome.omnibox.onInputEntered.addListener(async (text) => {
  // Query the API
  try {
    const res = await fetch("https://api.gpt-oss.com/chatkit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add "Authorization": "Bearer YOUR_KEY" if needed
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);

    // Open a tab showing the reply
    const html = `
      <html>
        <body style="font-family:sans-serif; padding:20px;">
          <h2>Your prompt:</h2>
          <pre>${text}</pre>
          <h2>Reply:</h2>
          <pre>${reply}</pre>
        </body>
      </html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    chrome.tabs.create({ url });
  } catch (err) {
    chrome.tabs.create({
      url: "data:text/html,<h1>Error</h1><pre>" + err.message + "</pre>"
    });
  }
});
