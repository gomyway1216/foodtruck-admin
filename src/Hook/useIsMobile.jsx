import { useMediaQuery, useTheme } from '@mui/material';

const useIsMobile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  // 'sm' or another breakpoint value depending on the design

  return isMobile;
};

export default useIsMobile;