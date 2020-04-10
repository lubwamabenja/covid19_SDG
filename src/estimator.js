const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;
    // global variable
  const calculateDays = (period, value) => {
    switch (period) {
      case 'months':
        return value * 30;

      case 'weeks':
        return value * 7;

      default:
        return value;
    }
  };


  // global Functions

  const hospitalBedsByRequestedTime = (totalBeds, CasesByRequestedTime) => {
    const occupiedBeds = (0.65 * totalBeds);
    const availableBeds = (totalBeds - occupiedBeds);
    return Math.trunc(availableBeds - CasesByRequestedTime);
  };

  const moneyLost = (infectionsByRequestedTime, percentageIncome, avgIncome, days) => {
    const estimatedLoss = infectionsByRequestedTime * percentageIncome * avgIncome * days;
    return parseFloat(estimatedLoss.toFixed(2));
  };


  //= ===========impact object computations
  const currentlyInfectedInfact = reportedCases * 10;
  const days = calculateDays(periodType, timeToElapse);
  const infectionsByRequestedTimeImpact = currentlyInfectedInfact * (2 ** Math.trunc(days / 3));
  const impactCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTimeImpact);
  const impactCasesForICU = Math.trunc(0.05 * infectionsByRequestedTimeImpact);
  const impactCasesForVentilators = Math.trunc(0.02 * infectionsByRequestedTimeImpact);


  //= ===========severe infact object computations
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * (2 ** Math.trunc(days / 3));
  const severeCasesByRequested = Math.trunc(infectionsByRequestedTimeSevere * 0.15);

  const severeCasesForICU = Math.trunc(0.05 * infectionsByRequestedTimeSevere);
  const severeCasesForVentilators = Math.trunc(0.02 * infectionsByRequestedTimeSevere);

  // impact object
  const impact = {
    currentlyInfected: currentlyInfectedInfact,
    infectionsByRequestedTime: infectionsByRequestedTimeImpact,
    severeCasesByRequestedTime: impactCasesByRequestedTime,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(totalHospitalBeds,
      impactCasesByRequestedTime),
    casesForICUByRequestedTime: impactCasesForICU,
    casesForVentilatorsByRequestedTime: impactCasesForVentilators,
    dollarsInFlight: moneyLost(infectionsByRequestedTimeImpact, region.avgDailyIncomePopulation,
      region.avgDailyIncomeInUSD, days)
  };
    // severe impact object


  const severeImpact = {
    currentlyInfected: currentlyInfectedSevere,
    infectionsByRequestedTime: infectionsByRequestedTimeSevere,
    severeCasesByRequestedTime: severeCasesByRequested,
    hospitalBedsByRequestedTime: hospitalBedsByRequestedTime(totalHospitalBeds,
      severeCasesByRequested),
    casesForICUByRequestedTime: severeCasesForICU,
    casesForVentilatorsByRequestedTime: severeCasesForVentilators,
    dollarsInFlight: moneyLost(infectionsByRequestedTimeSevere, region.avgDailyIncomePopulation,
      region.avgDailyIncomeInUSD, days)
  };
  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
