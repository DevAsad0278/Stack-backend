const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Hello! Backend is working!");
});

// ✅ Existing message routes
const messageRoutes = require("./routes/message");
app.use("/api/messages", messageRoutes);

// ✅ New chatbot route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for Stack Fellows. Use the following company information to answer any questions from users in a polite and helpful way.

Company Name: Stack Fellows

📢 Slogan: We build stunning websites and boost your brand with digital marketing. Your success is our mission.

💡 Mission:
To empower businesses with innovative digital solutions that drive growth, enhance user experience, and create lasting value in the digital economy.

🧑‍💻 Services:
- Web Development (custom websites, responsive design, performance optimization, SEO ready, security first)
- Mobile App Development (native & cross-platform for iOS & Android, UI/UX design, app store optimization)
- Digital Marketing (SEO/SEM, social media marketing, content marketing, PPC advertising)
- UI/UX Design (user research, wireframing, prototyping, visual design)
- Analytics & Insights (Google Analytics, performance tracking, conversion optimization, ROI analysis)
- E-commerce Solutions (online stores, payment gateway integration, inventory management, order tracking)

🧰 Technologies:
Frontend: React, Vue.js, Angular, Next.js, TypeScript, Tailwind CSS
Backend: Node.js, Python, PHP, Java, Express.js, Django
Databases: MongoDB, PostgreSQL, MySQL, Redis, Firebase, Supabase
Tools: AWS, Docker, Git, Figma, Vercel, Netlify

🏆 Stats:
- 100+ happy clients
- 250+ projects completed
- 5+ years of experience
- 99% success rate

🤝 Team Members:
- M Asad Ullah (Project Manager & Developer)
- Zeeshan Haider (Full Stack Developer)
- Khansha Rana (Frontend Developer)
- Soma Khalil (Digital Marketing Expert)
- Rameen Meer (Full Stack Developer)
- Aman Fatima (Full Stack Developer)

📞 Contact:
- Email: stackfellows@gmail.com
- Phone & WhatsApp: +92 303 0278190
- Office: Johar Town, Lahore

🌟 Why choose us?
- Expert team with proven track record
- Custom solutions tailored to your needs
- Ongoing support and maintenance
- Transparent communication throughout

Use this information to accurately and confidently reply to any user queries about the company, services, technologies, team, or contact details. Always be friendly and supportive.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong with OpenAI." });
  }
});

// ✅ Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));
