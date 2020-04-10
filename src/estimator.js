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
    case 'weeks' || 'day':
      factor = Math.trunc((timeToElapse * 7) / 3);
      period = timeToElapse * 7;
      break;
    case 'months' || 'month':
      factor = Math.trunc((timeToElapse * 30) / 3);
      period = timeToElapse * 30;
      break;
    default:
      factor = Math.trunc(timeToElapse / 3);
      period = timeToElapse;
  }

  // Global Functions

  const lostMoney = (infections, avgIncome, avgPopulation, days) => {
    const outcome = infections * avgIncome * avgPopulation;
    const result = (outcome / days);
    return parseFloat(result);
  };

  const icuCases = (infections, num) => {
    const output = infections * num;
    return Math.trunc(output);
  };

  const ventilatorCases = (infections, num) => {
    const output = infections * num;
    return Math.trunc(output);
  };

  //= ===========impact object computations
  const currentlyInfectedInfact = reportedCases * 10;
  const infectionsByRequestedTimeImpact = currentlyInfectedInfact * (2 ** factor);
  const impactCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTimeImpact);
  const impactAvailableBeds = Math.trunc((totalHospitalBeds * 0.35) - impactCasesByRequestedTime);


  //= ===========severe infact object computations
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * (2 ** factor);
  const severeCasesByRequested = Math.trunc(infectionsByRequestedTimeSevere * 0.15);
  const severeAvailabelBeds = Math.trunc((totalHospitalBeds * 0.35) - severeCasesByRequested);


  // impact object
  const impact = {
    currentlyInfected: currentlyInfectedInfact,
    infectionsByRequestedTime: infectionsByRequestedTimeImpact,
    severeCasesByRequestedTime: impactCasesByRequestedTime,
    hospitalBedsByRequestedTime: impactAvailableBeds,
    casesForICUByRequestedTime: icuCases(infectionsByRequestedTimeImpact, 0.05),
    casesForVentilatorsByRequestedTime: ventilatorCases(infectionsByRequestedTimeImpact, 0.02),
    dollarsInFlight: (lostMoney(infectionsByRequestedTimeImpact, region.avgDailyIncomeInUSD,
      region.avgDailyIncomePopulation, period)).toFixed(2)
  };
  // severe impact object

  const severeImpact = {
    currentlyInfected: currentlyInfectedSevere,
    infectionsByRequestedTime: infectionsByRequestedTimeSevere,
    severeCasesByRequestedTime: severeCasesByRequested,
    hospitalBedsByRequestedTime: severeAvailabelBeds,
    casesForICUByRequestedTime: icuCases(infectionsByRequestedTimeSevere, 0.05),
    casesForVentilatorsByRequestedTime: ventilatorCases(infectionsByRequestedTimeSevere, 0.02),
    dollarsInFlight: (lostMoney(infectionsByRequestedTimeSevere, region.avgDailyIncomeInUSD,
      region.avgDailyIncomePopulation, period)).toFixed(2)
  };
  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
