// function to calculate available
export const losses = (infectionsByRequestedTime, percentageIncome, avgIncome, days) => {
  const estimatedLoss = (infectionsByRequestedTime * percentageIncome * avgIncome) / days;
  return Math.floor(estimatedLoss);
};

export const calcluateDays = (periodType, value) => {
  switch (periodType) {
    case 'months':
      return value * 30;

    case 'weeks':
      return value * 7;

    default:
      return value;
  }
};

export const prototypeEstimator = ({
  reportedCases,
  totalHospitalBeds,
  periodType,
  timeToElapse,
  region
}, infectedCases) => {
  const numberOfDays = calcluateDays(periodType, timeToElapse);
  const currentlyInfected = reportedCases * infectedCases;
  const infectionsByRequestedTime = currentlyInfected * (2 ** Math.floor(numberOfDays / 3));
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: Math.trunc((totalHospitalBeds * 0.35)
    - severeCasesByRequestedTime),
    casesForICUByRequestedTime: Math.floor(0.05 * infectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.floor(0.02 * infectionsByRequestedTime),
    dollarsInFlight: losses(
      infectionsByRequestedTime,
      region.avgDailyIncomePopulation,
      region.avgDailyIncomeInUSD,
      numberOfDays
    )
  };
};
