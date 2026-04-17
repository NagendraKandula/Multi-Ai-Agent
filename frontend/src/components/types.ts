export interface FormData {
  // Step 1
  businessName: string;
  location: string;
  budgetRange: string;
  targetMarket: string;
  businessType: string;
  problemSolving: string;
  currentSolution: string;
  betterSolution: string;
  stage: string;
  helpNeeded: string;

  // Step 2 – Tech
  productType: string;
  userAccess: string;
  mvpFeatures: string;
  uxPriority: string;
  userInteraction: string;
  techStack: string;
  buildPriority: string;
  expectedUsers: string;
  dataAiReliance: string;
  sensitiveData: string;
  industry: string;

  // Step 2 – Non Tech
  nonTechBusinessType: string;
  providing: string;
  businessOperation: string;
  operationComplexity: string;
  supplierDependency: string;
  dependencyType: string;
  timeSensitivity: string;
  nonTechIndustry: string;
  licensesRequired: string;

  // Step 2 – Both
  businessDriver: string;
  technologyUsage: string;
  customerInteraction: string;
  platformFeatures: string;
  physicalComponent: string;
  bothOperationComplexity: string;
  bothSupplierDependency: string;
  bothTimeSensitivity: string;
  platformPreference: string;
  scaleExpectation: string;
  speedVsScalability: string;
  bothIndustry: string;
  dataSensitivity: string;
  bothLicensesRequired: string;

  // Step 2 – Not Sure
  notSureCustomerInteraction: string;
  notSureCoreOffering: string;
  notSureRoleOfTechnology: string;
  notSurePhysicalOperations: string;
  notSureUserExperience: string;
  notSureScaleExpectation: string;
  notSureAutomation: string;
  classifiedBusinessType: string;

  // Step 3
  idealCustomer: string;
  marketScope: string;
  competitors: string;
  revenueModel: string;
  growthGoal: string;
  roiTimeline: string;

  // Step 4
  speedToLaunch: number;
  productQuality: number;
  costEfficiency: number;
  constraint: string;
  riskAppetite: string;
  founderExperience: string;
  successMetric: string;
  selectedAgents: string[];
}