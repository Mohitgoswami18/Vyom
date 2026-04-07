import { Card } from "@/components/ui/card";
import { Code2, Database, Zap, Cpu } from "lucide-react";

const techStack = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["React.js", "TailwindCSS", "shadcn UI"],
    color: "from-blue-400 to-cyan-400",
  },
  {
    category: "Backend & Database",
    icon: Zap,
    items: ["Node.js", "Express.js", "FAST API", "Mongo DB"],
    color: "from-green-400 to-emerald-400",
  },
  {
      category: "AI & Integrations",
      icon: Cpu,
      items: ["GPT-4", "LLaMA", "Internshala API", "Wellfound API", "langchain"],
      color: "from-accent to-purple-500",
    },
    {
      category: "Tools and Technologies",
      icon: Zap,
      items: ["Git/ GitHub", "Postman", "VS Code"],
      color: "from-green-400 to-emerald-400",
    },
];

const TechStack = () => {
  return (
    <section
      id="tech-stack"
      className="w-full pb-20 md:pb-32 bg-linear-to-b from-transparent via-purple-500/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4">
            Built with Modern Tech
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade technology stack for reliability and performance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <Card
                key={i}
                className="relative group overflow-hidden border border-border/50 hover:border-purple-600/50 transition-all duration-300 bg-[#141418]/40 backdrop-blur-sm hover:bg-[#141418]/90"
              >
                <div className="p-8 space-y-6">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-linear-to-br ${tech.color}`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {tech.category}
                  </h3>

                  <div className="space-y-2">
                    {tech.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechStack