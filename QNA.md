# Y Combinator Application Q&A: Nexus Wellness

### Describe what your company does in 50 characters or less.*
AI-guided daily wellness companion for habits.

### What is your company going to make? Please describe your product and what it does or will do.
We are building Nexus Wellness, a web-first Progressive Web Application (PWA) that acts as a daily wellness companion. The app provides users with a guided, personalized daily routine that takes only 10-20 minutes to complete. Each routine includes a mini-workout, a lifestyle tip, a breathing exercise, a healthy meal idea, and a "challenge of the day." We use the Gemini 1.5 API to generate custom instructions for exercises and recipes based on user preferences (mood, skill level, dietary needs), ensuring that the advice is actionable and specific rather than generic.

### Where do you live now, and where would the company be based after YC?
Delhi, India / San Francisco, USA

### Explain your decision regarding location.
We are currently based in Delhi to leverage a strong technical talent pool and the growing health-tech interest in the region. Post-YC, we plan to relocate to San Francisco to be at the heart of the global startup ecosystem. This move is strategic for accessing venture capital, world-class engineering talent, and the active YC founder community, which will be critical for scaling Nexus Wellness into a global platform.

### Progress: How far along are you?
We have completed the core project scaffolding and design system. The backend is built using Express and PostgreSQL, and the frontend is a React-based PWA. We have implemented the "Routine Engine" which pulls from a curated content repository and have successfully integrated the Gemini 1.5 API for dynamic content generation. We are currently in the beta phase, conducting internal testing and refining the habit-persistence logic.

### How long have each of you been working on this? How much of that has been full-time? Please explain.
The team consists of two founders: Vaibhav (CEO) and Khalid (CTO). We have been working on the vision and technical foundations of Nexus for approximately 4 months. We have dedicated ourselves full-time to the project for the last 2 months, prioritizing building a high-performance MVP that removes all friction for the end-user.

### What tech stack are you using, or planning to use, to build this product? Include AI models and AI coding tools you use.
- **Frontend**: React, Vite, Framer Motion (for animations), Lucide (for iconography).
- **Backend/Storage**: Express.js, PostgreSQL, LocalStorage (for offline persistence).
- **AI Models**: Gemini 1.5 Pro and Flash for personalized routine generation.
- **AI Coding Tools**: Antigravity, Gemini-integrated IDEs, and Cursor for accelerated development.
- **Deployment**: PWA architecture for cross-platform accessibility without app store dependencies.

### Idea: Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?
We noticed that existing wellness apps are either too complex (overwhelming users with tracking) or heavily pay-walled from day one. As developers who struggle with maintaining consistency ourselves, we wanted a tool that "just tells me what to do" in 15 minutes. We have domain expertise in building AI-powered consumer tools and understanding UX friction. We know people need this because of the high churn rates in complex fitness apps and the increasing demand for "low-friction" health interventions among busy professionals and students.

### Who are your competitors? What do you understand about your business that they don't?
Our direct competitors include Headspace, Calm (meditation), and Nike Training Club (fitness). Our edge is "Actionable Integration." While competitors are fragmented (focusing on only one pillar), Nexus provides a holistic daily "dose" of wellness across multiple pillars (physical, mental, nutritional) in one place. We understand that consistency is hindered by choice paralysis; by providing a single, personalized daily routine, we remove the friction of "what should I do today?"

### How do or will you make money? How much could you make?
We are following a "Freemium" model. 80% of our core content remains free to build a massive user base and trust. We will monetize through:
1. Premium subscriptions for advanced, long-term plans.
2. Personalized coaching or advanced biometric analysis.
3. Affiliate partnerships with nutrition and wellness brands.
Best estimate: With the global wellness market exceeding $500B, we aim for $500k ARR within 18 months by capturing the "entry-level" segment and converting them to premium routines.

### If you have not formed the company yet, describe the planned equity ownership breakdown.
- Vaibhav (CEO): 45%
- Khalid (CTO): 45%
- Employee Option Pool: 10%
(This ensures founder alignment and leaves room for early key hires).

### What convinced you to apply to Y Combinator? Did someone encourage you to apply? Have you been to any YC events?
We were convinced by YC's track record of helping technical founders scale rapidly and navigate the complexities of global markets. We were encouraged to apply by mentors who have gone through the program. We have active participants in YC Startup School and have closely followed YC-partner content on scaling consumer platforms.

### How did you hear about Y Combinator?
Through the tech community, Hacker News, Paul Graham's essays on startup methodology, and the extensive YC Library which served as our guide for the initial project planning.

---

### Speech: Introducing Nexes Wellness

**Speaker: Vaibhav, Founder of Nexes Wellness**

"Hi everyone, I’m **Vaibhav**, the founder of **Nexes Wellness**.

The reason I started this company is deeply personal. Like many of you, I struggled to maintain a consistent wellness routine. I found myself juggling multiple apps—one for meditation, another for workouts, and a third for tracking what I ate. The problem wasn’t an absence of tools; it was the **friction of choice** and the **overwhelming complexity** of existing platforms. Most wellness apps today either paralyze users with too many options or lock their core value behind steep paywalls before a habit can even be formed.

We are solving this with **Nexes Wellness**. 

Nexes is an AI-guided daily wellness companion that removes the guesswork from your day. Instead of overwhelming you, we provide a single, personalized 15-minute routine that covers your physical, mental, and nutritional needs in one place. 

One of our standout features is the **Intelligent Diet Engine**. We know that nutrition is the hardest part of consistency. Our AI doesn't just give you a generic meal plan; it uses Gemini 1.5 to generate recipes based on your mood, preferred cuisine (whether Indian, Mexican, or American), and even the ingredients you already have in your kitchen. It’s like having a personal chef who knows exactly what you need to eat to stay on track.

By leveraging AI to craft actionable, low-friction plans across workouts, meditation, and diet, we turn the struggle of consistency into a simple daily habit. 

Our goal is straightforward: to make wellness accessible, integrated, and effortless for everyone."
