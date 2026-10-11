import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Bug Bounty & Attack Surface Intelligence with High Thinking Mode
  app.post('/api/hunter-intelligence', async (req, res) => {
    try {
      const {
        programName,
        programHandle,
        bountyRange,
        features,
        assetTypes,
        industries,
        targetScope,
        queryType = 'attack-surface-strategy',
        userQuery,
        researcherNotes,
        severityTarget = 'Critical',
      } = req.body;

      const systemInstruction = `You are a Principal Security Researcher, HackerOne Top 10 Hunter, and Hall of Fame Bug Bounty Strategist.
Your mission is to perform deep technical reasoning and provide actionable, rigorous, and safe vulnerability research intelligence tailored specifically to the given HackerOne program scope.

Always emphasize:
1. Adherence to Safe Harbor and HackerOne Disclosure Guidelines (no disruptive DoS, no unauthorized data exfiltration, stay strictly within authorized scope).
2. Deep architectural reasoning: understand the target's industry, tech stack, and threat landscape.
3. High-impact vulnerability chains (e.g. Account Takeover via OAuth misconfiguration, IDOR leading to PII exposure, SSRF to Cloud Metadata/Internal Microservices, Second-order SQLi, Deserialization, Race conditions, Logic bugs).
4. Provide concrete testing methodologies, Burp Suite / curl / Python snippets where applicable, parameter discovery tips, and CVSS 3.1 scoring.
5. Format your output cleanly with markdown headers, bullet points, and code blocks.`;

      let prompt = ``;

      if (queryType === 'attack-surface-strategy') {
        prompt = `Perform a comprehensive, high-depth attack surface analysis and bug bounty hunting strategy for the following HackerOne target:

Target Program: ${programName} (@${programHandle || programName.toLowerCase()})
Bounty Range: ${bountyRange || 'Up to $50,000+'}
Program Badges & Features: ${(features || []).join(', ') || 'Bounty, Gold Standard'}
In-Scope Asset Types: ${(assetTypes || []).join(', ') || 'Domain, API, Wildcard'}
Industry: ${(industries || []).join(', ') || 'Technology'}
Specific Target Scope: ${targetScope || 'Primary wildcard & public assets'}
Severity Focus: ${severityTarget}

Specific Hunter Query / Context:
${userQuery || 'Develop a deep-dive offensive security methodology to identify high/critical severity vulnerabilities in this program within scope.'}

Please think deeply through:
1. Scope & Perimeter Analysis: High-ROI reconnaissance steps (subdomain enumeration, hidden apex nodes, CIDR/ASN verification, edge CDN endpoints).
2. Technology & Architecture Fingerprinting: Likely stack vulnerabilities (cloud providers, GraphQL vs REST, microservice gateways, auth proxies).
3. Critical Vulnerability Vectors: 4-5 high-yield vulnerability attack vectors specific to this target's business model and scope.
4. Testing Methodology & Payloads: Practical steps, parameter hunting, fuzzing strategies, and automation tips.
5. Scope Safety & Triage Success: How to write a rock-solid submission that gets triaged quickly and avoids duplicate/informative status.`;
      } else if (queryType === 'report-drafter') {
        prompt = `Draft an audit-grade, HackerOne Gold Standard Vulnerability Report for:
Program: ${programName}
Asset / Endpoint: ${targetScope || 'Target scope asset'}
Target Severity: ${severityTarget}
Hunter Finding Notes:
${researcherNotes || userQuery || 'Demonstrating an authentication bypass / IDOR vulnerability with unauthorized privilege escalation.'}

Provide a complete report including:
- Title (Professional HackerOne title syntax: [Vulnerability Type] in [Component] leads to [High Impact])
- Weakness / CWE Classification & Suggested CVSS v3.1 Vector & Score
- Executive Summary & Asset Impact
- Step-by-Step Proof of Concept (PoC) with realistic HTTP requests/responses or reproduction steps
- Impact & Threat Scenario (Explain how an attacker leverages this in production)
- Remediation & Hardening Recommendations (Code/architectural guidance)`;
      } else if (queryType === 'disclosed-report-breakdown') {
        prompt = `Perform a deep technical dissection and exploit analysis of the following disclosed vulnerability from HackerOne:

Report Title: ${req.body.reportTitle || targetScope}
Program / Vendor: ${programName}
Weakness / CWE: ${req.body.weaknessCwe || 'Software Vulnerability'}
Reporter: ${req.body.reporter || 'Security Researcher'}
Disclosed Summary:
${researcherNotes || userQuery}

Deeply analyze:
1. Root Cause Breakdown: Explain the exact programming, architectural, or configuration flaw that created this vulnerability.
2. Exploit Mechanics & Chain: Step-by-step technical explanation of how the researcher identified and leveraged this condition (e.g. token forgery, unvalidated bounds, race conditions).
3. Severity & Impact Validation: Why this flaw is rated at its severity and real-world blast radius in production.
4. Defense & Engineering Fix: How the vendor properly remediated the vulnerability (code-level safeguards, architectural isolation, defense-in-depth).
5. Hunting Takeaways: How security researchers can hunt for similar pattern vulnerabilities in other programs.`;
      } else if (queryType === 'scope-checker') {
        prompt = `Analyze safe harbor boundaries and scope validation for ${programName}:
Asset in question: ${targetScope}
Hunter intent: ${userQuery}

Deeply evaluate:
1. Is this asset likely within standard scope guidelines for this type of program?
2. Critical out-of-scope hazards (third-party CDNs, shared SaaS services like Zendesk/Salesforce, employee SSO, social engineering, rate-limiting spam).
3. Safe verification techniques (Proof of Concept without data loss or downtime).
4. HackerOne Triage and Mediation advice if scope dispute occurs.`;
      } else {
        prompt = `HackerOne Target Context:
Program: ${programName}
Bounty Range: ${bountyRange}
Features: ${(features || []).join(', ')}
Asset Types: ${(assetTypes || []).join(', ')}
Scope: ${targetScope || 'Standard Program Scope'}

Question / Research Request:
${userQuery}

Analyze this thoroughly using deep cybersecurity and bug bounty methodology reasoning.`;
      }

      // Generate content with gemini-3.1-pro-preview and high thinking mode
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction,
        },
      });

      const responseText = response.text || 'No response generated from the model.';

      res.json({
        success: true,
        text: responseText,
        model: 'gemini-3.1-pro-preview',
        thinkingLevel: 'HIGH',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error generating hunter intelligence:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate intelligence',
      });
    }
  });

  // Serve static assets in production or use Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HackerOne Explorer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
