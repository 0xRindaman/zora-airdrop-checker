export default async function handler(req, res) {
    const { address } = req.query;
  
    const query = `
      query {
        zoraTokenAllocation(identifierWalletAddresses: "${address}") {
          totalTokensEarned {
            totalTokens
          }
        }
      }
    `;
  
    try {
      const response = await fetch("https://api.zora.co/universal/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
  
      if (data.detail === "Ratelimit exceeded please try again later.") {
        return res.status(429).json({ error: "Zora API rate limit exceeded. Please wait a few seconds and try again." });
      }
  
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(data);
    } catch {
      res.status(500).json({ error: "Failed to fetch Zora data." });
    }
  }
  