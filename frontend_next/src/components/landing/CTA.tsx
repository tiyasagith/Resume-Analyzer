"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const CTA = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to <span className="text-gradient">Transform</span> Your
            Career?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join thousands of job seekers who landed their dream roles with our
            AI-powered resume analysis.
          </p>
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button variant="hero" size="lg" className="px-10 py-6 text-base">
              Analyze My Resume
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
