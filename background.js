chrome.omnibox.onInputEntered.addListener(async (text) => {
  try {
    const res = await fetch("https://api.gpt-oss.com/chatkit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // "Authorization": "Bearer YOUR_KEY" // add this if API needs a key
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }]
      })
    });

    let reply;
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      reply = data?.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
    } else {
      reply = await res.text(); // fallback if plain text or error
    }

    // Encode safely for data URL
    const html = `
      <html>
        <body style="font-family:sans-serif; padding:20px;">
          <h2>Your prompt:</h2>
          <pre>${text}</pre>
          <h2>Reply:</h2>
          <pre>${reply}</pre>
        </body>
      </html>`;
    const dataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);

    chrome.tabs.create({ url: dataUrl });
  } catch (err) {
    chrome.tabs.create({
      url: "data:text/html,<h1>Error</h1><pre>" + encodeURIComponent(err.message) + "</pre>"
    });
  }
});
