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
  //= ===========impact object computations
  const currentlyInfectedInfact = reportedCases * 10;
  const infectionsByRequestedTimeImpact = currentlyInfectedInfact * (2 ** factor);
  const impactCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTimeImpact);
  const impactAvailableBeds = Math.trunc((totalHospitalBeds * 0.35) - impactCasesByRequestedTime);
  const impactCasesForICU = infectionsByRequestedTimeImpact * 0.05;
  const impactCasesForVentilators = 0.02 * infectionsByRequestedTimeImpact;
  const impactDollarsInFlight = parseFloat((infectionsByRequestedTimeImpact
    * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / period);


  //= ===========severe infact object computations
  const currentlyInfectedSevere = reportedCases * 50;
  const infectionsByRequestedTimeSevere = currentlyInfectedSevere * (2 ** factor);
  const severeCasesByRequested = Math.trunc(infectionsByRequestedTimeSevere * 0.15);
  const severeAvailabelBeds = Math.trunc((totalHospitalBeds * 0.35) - severeCasesByRequested);
  const severeCasesForICU = infectionsByRequestedTimeSevere * 0.05;
  const severeCasesForVentilators = infectionsByRequestedTimeSevere * 0.02;
  const severeDollarsInFlight = parseFloat((infectionsByRequestedTimeSevere
    * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / period);

  // impact object
  const impact = {
    currentlyInfected: currentlyInfectedInfact,
    infectionsByRequestedTime: infectionsByRequestedTimeImpact,
    severeCasesByRequestedTime: impactCasesByRequestedTime,
    hospitalBedsByRequestedTime: impactAvailableBeds,
    casesForICUByRequestedTime: impactCasesForICU,
    casesForVentilatorsByRequestedTime: impactCasesForVentilators,
    dollarsInFlight: (impactDollarsInFlight).toFixed(2)
  };
  // severe impact object

  const severeImpact = {
    currentlyInfected: currentlyInfectedSevere,
    infectionsByRequestedTime: infectionsByRequestedTimeSevere,
    severeCasesByRequestedTime: severeCasesByRequested,
    hospitalBedsByRequestedTime: severeAvailabelBeds,
    casesForICUByRequestedTime: severeCasesForICU,
    casesForVentilatorsByRequestedTime: severeCasesForVentilators,
    dollarsInFlight: (severeDollarsInFlight).toFixed(2)
  };
  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
