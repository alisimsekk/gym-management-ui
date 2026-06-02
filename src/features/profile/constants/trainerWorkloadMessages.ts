export const TRAINER_WORKLOAD_EMPTY_TRAINER =
  'Henüz kayıtlı antrenmanınız bulunmuyor. İş yükü özeti, ilk antrenman planlandığında oluşturulur.'

export const trainerWorkloadEmptyAdminMessage = (username: string): string =>
  `@${username} için henüz kayıtlı antrenman bulunmuyor. İş yükü raporu, antrenörün ilk antrenmanı planlandığında oluşturulur.`

export const TRAINER_WORKLOAD_ERROR_FALLBACK = 'Rapor alınamadı.'
