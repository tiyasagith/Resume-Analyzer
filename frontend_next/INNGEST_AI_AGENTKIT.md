# Inngest AI AgentKit Integration

This document explains how the Resume Analyzer app integrates with Inngest AI AgentKit to provide intelligent, asynchronous resume analysis and optimization.

## Overview

The integration leverages Inngest's event-driven architecture to create powerful AI-powered workflows that:

1. **Analyze resumes** against job descriptions using advanced AI
2. **Optimize resume content** with personalized suggestions
3. **Generate interview preparation** guides
4. **Provide actionable improvement plans**

## Architecture

### Core Components

- **Inngest Client** (`src/inngest/client.ts`): Configures the Inngest connection
- **AI Functions** (`src/inngest/functions.ts`): Defines the AI-powered workflows
- **API Route** (`src/app/api/inngest/route.ts`): Exposes Inngest functions to the web
- **React Hook** (`src/hooks/useInngestAgent.ts`): Provides easy client-side access
- **UI Component** (`src/components/AIResumeAnalyzer.tsx`): Complete demo interface

### AI AgentKit Functions

#### 1. `processResumeUpload` (Enhanced)
- **Event**: `resume/upload.started`
- **Purpose**: Process uploaded resumes with AI-powered ATS analysis
- **Steps**:
  1. Upload file to storage
  2. Analyze resume with AI (using existing `analyzeResume` function)
  3. Save results to database

#### 2. `aiResumeAnalysis` (New)
- **Event**: `resume/ai-analysis.requested`
- **Purpose**: Comprehensive AI analysis with detailed insights
- **Steps**:
  1. Validate inputs
  2. Extract structured resume data
  3. Perform comprehensive AI analysis
  4. Generate improvement plan
  5. Create interview preparation guide

#### 3. `aiResumeOptimization` (New)
- **Event**: `resume/optimization.requested`
- **Purpose**: Generate personalized resume optimization suggestions
- **Steps**:
  1. Analyze current resume state
  2. Generate content optimization suggestions
  3. Generate ATS optimization recommendations
  4. Create prioritized action plan

## Usage

### Client-Side Usage

```typescript
import { useInngestAgent } from "@/hooks/useInngestAgent";

function MyComponent() {
  const { triggerAIAnalysis, triggerOptimization } = useInngestAgent();

  const handleAnalysis = async () => {
    const result = await triggerAIAnalysis({
      resumeText: "Your resume text...",
      jobDescription: "Job description...",
      companyName: "Company name",
      jobTitle: "Job title",
      analysisType: "deep"
    });

    if (result.success) {
      console.log("Analysis started with event ID:", result.eventId);
    }
  };

  const handleOptimization = async () => {
    const result = await triggerOptimization({
      resumeText: "Your resume text...",
      targetRole: "Software Engineer",
      targetCompany: "Google"
    });

    if (result.success) {
      console.log("Optimization started with event ID:", result.eventId);
    }
  };
}
```

### Server-Side Event Sending

```typescript
import { inngest } from "@/inngest/client";

// Send events directly from server-side code
await inngest.send({
  name: "resume/ai-analysis.requested",
  data: {
    resumeText: "...",
    jobDescription: "...",
    companyName: "...",
    jobTitle: "...",
    analysisType: "standard"
  }
});
```

## Features

### AI Analysis Features

- **ATS Compatibility Scoring**: Evaluates how well your resume will perform with automated systems
- **Content Quality Analysis**: Identifies weak bullet points and missing quantifications
- **Job Description Matching**: Compares skills and requirements against target roles
- **Structure & Formatting**: Checks resume layout and section organization
- **Skills Assessment**: Identifies skill gaps and ghost skills
- **Company Intelligence**: Provides company-specific tips and culture insights
- **Interview Preparation**: Generates likely interview questions with STAR outlines
- **Actionable Recommendations**: Prioritized improvement suggestions with time estimates

### Optimization Features

- **Content Enhancement**: Suggests stronger action verbs and metrics
- **Summary Generation**: Creates compelling professional summaries
- **Keyword Optimization**: Improves ATS keyword matching
- **Formatting Recommendations**: Ensures ATS-friendly formatting
- **Prioritized Action Plans**: Organizes improvements by impact and effort

## Development

### Running Inngest Locally

1. Start the Inngest dev server:
```bash
npm run inngest
```

2. This will start the Inngest CLI and connect your local functions

3. Visit the Inngest dashboard to monitor function executions

### Adding New AI Functions

1. Define the function in `src/inngest/functions.ts`:
```typescript
export const newAIFunction = inngest.createFunction(
  { 
    id: "new-ai-function",
    name: "New AI Function",
    triggers: { event: "resume/new-function.requested" }
  },
  async ({ event, step }) => {
    // Your AI logic here
    return { success: true, result: "..." };
  }
);
```

2. Add it to the API route:
```typescript
// src/app/api/inngest/route.ts
import { newAIFunction } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, processResumeUpload, aiResumeAnalysis, aiResumeOptimization, newAIFunction],
});
```

3. Add a trigger in the React hook:
```typescript
// src/hooks/useInngestAgent.ts
const triggerNewFunction = useCallback(async (input: NewFunctionInput) => {
  try {
    const event = await inngest.send({
      name: "resume/new-function.requested",
      data: input
    });
    return { success: true, eventId: event.ids[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}, []);
```

## Monitoring and Debugging

### Inngest Dashboard

- Access the dashboard at `http://localhost:8288` when running locally
- Monitor function executions, timing, and errors
- View event payloads and function outputs

### Error Handling

All functions include comprehensive error handling:

```typescript
try {
  const result = await analyzeResume({...});
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
} catch (error) {
  console.error("Analysis failed:", error);
  // Fallback logic or re-throw
}
```

### Logging

Functions include detailed logging for debugging:

```typescript
console.log("Analyzing resume for:", companyName, jobTitle);
console.error("AI Analysis failed:", error);
```

## Best Practices

1. **Event Naming**: Use descriptive event names with domain prefixes (`resume/analysis.requested`)
2. **Data Validation**: Validate inputs early in the function pipeline
3. **Error Recovery**: Provide fallbacks when AI services fail
4. **Step Organization**: Break complex operations into logical steps
5. **Type Safety**: Use TypeScript interfaces for all data structures
6. **Monitoring**: Set up alerts for function failures and performance issues

## Production Deployment

1. Set up Inngest Cloud account
2. Configure environment variables:
   - `INNGEST_EVENT_KEY`: Your Inngest event key
   - `INNGEST_SIGNING_KEY`: Your signing key (if using)
3. Deploy your application
4. Update the Inngest client configuration for production

## Example Use Cases

### 1. Job Application Enhancement
- User uploads resume and job description
- System analyzes match and provides specific improvements
- Generates interview questions based on gaps

### 2. Resume Optimization Service
- User wants to improve general resume quality
- System provides content and formatting suggestions
- Creates prioritized action plan with time estimates

### 3. Career Coaching Integration
- Coaches can trigger analyses for clients
- Track improvement over time
- Generate personalized coaching plans

## Support

For issues with the Inngest integration:
1. Check the Inngest dashboard for function execution details
2. Review console logs in your application
3. Consult the [Inngest documentation](https://inngest.com/docs)
4. Check the [AI AgentKit guide](https://agentkit.inngest.com/)
