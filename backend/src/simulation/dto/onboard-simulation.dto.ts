import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class OnboardSimulationDto {
  // Step 1: Basic & Problem
  @IsString() businessName: string;
  @IsString() location: string;
  @IsString() budgetRange: string;
  @IsString() targetMarket: string;
  @IsString() businessType: 'Tech' | 'Non Tech' | 'Both' | 'Not Sure';
  @IsString() problemSolving: string;
  @IsString() currentSolution: string;
  @IsString() betterSolution: string;
  @IsString() stage: string;
  @IsString() helpNeeded: string;

  // Step 2: Dynamic Sections (Marked Optional as they depend on businessType)
  // Tech Fields
  @IsOptional() @IsString() productType?: string;
  @IsOptional() @IsString() userAccess?: string;
  @IsOptional() @IsString() mvpFeatures?: string;
  @IsOptional() @IsString() uxPriority?: string;
  @IsOptional() @IsString() userInteraction?: string;
  @IsOptional() @IsString() techStack?: string;
  @IsOptional() @IsString() buildPriority?: string;
  @IsOptional() @IsString() expectedUsers?: string;
  @IsOptional() @IsString() dataAiReliance?: string;
  @IsOptional() @IsString() sensitiveData?: string;
  @IsOptional() @IsString() industry?: string;

  // Non-Tech Fields
  @IsOptional() @IsString() nonTechBusinessType?: string;
  @IsOptional() @IsString() providing?: string;
  @IsOptional() @IsString() businessOperation?: string;
  @IsOptional() @IsString() operationComplexity?: string;
  @IsOptional() @IsString() supplierDependency?: string;
  @IsOptional() @IsString() dependencyType?: string;
  @IsOptional() @IsString() timeSensitivity?: string;
  @IsOptional() @IsString() nonTechIndustry?: string;
  @IsOptional() @IsString() licensesRequired?: string;

  // Step 3: Market & Business
  @IsString() idealCustomer: string;
  @IsString() marketScope: string;
  @IsString() competitors: string;
  @IsString() revenueModel: string;
  @IsString() growthGoal: string;
  @IsString() roiTimeline: string;

  // Step 4: Strategy & AI Setup
  @IsNumber() speedToLaunch: number;
  @IsNumber() productQuality: number;
  @IsNumber() costEfficiency: number;
  @IsString() constraint: string;
  @IsString() riskAppetite: string;
  @IsString() founderExperience: string;
  @IsString() successMetric: string;
  @IsArray() @IsString({ each: true }) selectedAgents: string[];
}