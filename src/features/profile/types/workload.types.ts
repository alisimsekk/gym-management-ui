export interface MonthlyWorkload {
  month: string
  totalTrainingDuration: number
}

export interface YearlyWorkload {
  year: number
  monthlyWorkloads: MonthlyWorkload[]
}

export interface TrainerWorkloadSummary {
  trainerUsername: string
  trainerFirstName: string
  trainerLastName: string
  active: boolean
  yearlyWorkloads: YearlyWorkload[]
}
