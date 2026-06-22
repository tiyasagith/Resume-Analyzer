"use client";
import { motion } from "framer-motion";
import { Brain, Target, FileSearch, TrendingUp, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Score Analysis",
    description: "Get an instant score with detailed breakdown of your resume's strengths and weaknesses.",
  },
  {
    icon: Target,
    title: "Job Matching",
    description: "Compare your resume against job descriptions and see how well you match.",
  },
  {
    icon: FileSearch,
    title: "ATS Optimization",
    description: "Ensure your resume passes Applicant Tracking Systems with keyword optimization.",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description: "Identify missing skills and get recommendations for in-demand competencies.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Receive actionable suggestions in seconds, not days. Iterate and improve fast.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. We delete your resume after analysis.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient">Stand Out</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Powerful AI tools designed to give you the competitive edge in your job search.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-background border border-border/50 hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
