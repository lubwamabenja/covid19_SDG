const Output = ({
  avgDailyIncomeInUSD,
  avgDailyIncomePopulation,
  periodType,
  timeToElapse,
  reportedCases,
  totalHospitalBeds,
  estimationFactor
}) => {
  this.periodType = periodType;
  this.timeToElapse = timeToElapse;
  this.reportedCases = reportedCases;
  this.totalHospitalBeds = totalHospitalBeds;
  this.avgDailyIncomePopulation = avgDailyIncomePopulation;
  this.avgDailyIncomeInUSD = avgDailyIncomeInUSD;
  this.estimationFactor = estimationFactor;
};
/* eslint-disable consistent-return */

Output.prototype.convertToDays = () => {
  if (this.periodType === 'days' || this.periodType === 'day') {
    return this.timeToElapse;
  }
  if (this.periodType === 'weeks' || this.periodType === 'week') {
    return this.timeToElapse * 7;
  }
  if (this.periodType === 'months' || this.periodType === 'month') {
    return this.timeToElapse * 30;
  }
};

Output.prototype.rateOfInfection = () => {
  const days = this.convertToDays() / 3;

  return 2 ** Math.trunc(days);
};

Output.prototype.currentlyInfected = () => this.reportedCases * this.estimationFactor;
Output.prototype.infectionsByRequestedTime = () => this.currentlyInfected()
* this.rateOfInfection();
Output.prototype.severeCasesByRequestedTime = () => Math.trunc(this.infectionsByRequestedTime()
* 0.15);
Output.prototype.hospitalBedsByRequestedTime = () => Math.trunc((this.totalHospitalBeds * 0.35)
- this.severeCasesByRequestedTime());

Output.prototype.casesForICUByRequestedTime = () => Math.trunc(this.infectionsByRequestedTime()
* 0.05);

Output.prototype.casesForVentilatorsByRequestedTime = () => Math.trunc(this
  .infectionsByRequestedTime()
* 0.02);
Output.prototype.dollarsInFlight = () => {
  const factor = this.avgDailyIncomePopulation * this.avgDailyIncomeInUSD;
  const days = this.convertToDays();
  const res = (this.infectionsByRequestedTime() * factor) / days;
  return Math.trunc(res);
};


Output.prototype.results = () => ({
  currentlyInfected: this.currentlyInfected(),
  infectionsByRequestedTime: this.infectionsByRequestedTime(),
  severeCasesByRequestedTime: this.severeCasesByRequestedTime(),
  hospitalBedsByRequestedTime: this.hospitalBedsByRequestedTime(),
  casesForICUByRequestedTime: this.casesForICUByRequestedTime(),
  casesForVentilatorsByRequestedTime: this.casesForVentilatorsByRequestedTime(),
  dollarsInFlight: this.dollarsInFlight()

});

const covid19ImpactEstimator = (data) => {
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;


  const impact = new Output({
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds,
    estimationFactor: 10
  });

  const severeImpact = new Output({
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds,
    estimationFactor: 50
  });

  return {
    data,
    impact: impact.results(),
    severeImpact: severeImpact.results()
  };
};

module.exports = covid19ImpactEstimator;
