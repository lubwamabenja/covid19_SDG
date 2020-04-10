const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;
    // global variable
  let factor;
  let period;
  switch (periodType) {
    case 'months':
      factor = Math.trunc((timeToElapse * 30) / 3);
      period = timeToElapse * 30;
      break;
    case 'weeks':
      factor = Math.trunc((timeToElapse * 7) / 3);
      period = timeToElapse * 7;
      break;

    default:
      factor = Math.trunc(timeToElapse / 3);
      period = timeToElapse;
      break;
  }


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
  const infectionsByRequestedTimeImpact = currentlyInfectedInfact * (2 ** factor);
  const impactCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTimeImpact);
  const impactCasesForICU = Math.trunc(0.05 * infectionsByRequestedTimeImpact);
  const impactCasesForVentilators = Math.trunc(0.02 * infectionsByRequestedTimeImpact);


  //= ===========severe infact object computations
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * (2 ** factor);
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
      region.avgDailyIncomeInUSD, period)
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
      region.avgDailyIncomeInUSD, period)
  };
  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
