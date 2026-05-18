import type { PropsWithChildren } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { trainingPickerTheme } from '../theme/trainingPickerTheme'

dayjs.locale('tr')

export function TrainingScheduleLocalizationProvider({
  children,
}: PropsWithChildren) {
  return (
    <ThemeProvider theme={trainingPickerTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  )
}
