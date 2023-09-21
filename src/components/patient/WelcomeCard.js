// import React from 'react';
// import { Card, CardContent, Typography } from '@mui/material';
// import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles((theme) => ({
//   card: {
//     maxWidth: 500,
//     margin: '0 auto',
//     marginTop: theme.spacing(4),
//     backgroundColor: '#f9f9f9',
//     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
//     borderRadius: theme.spacing(2),
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: theme.spacing(3),
//   },
//   content: {
//     padding: theme.spacing(3),
//   },
// }));

// const WelcomeCard = () => {
//   const classes = useStyles();

//   return (
//     <Card className={classes.card}>
//       <CardContent className={classes.content}>
//         <Typography variant="h1" className={classes.title}>
//           Welcome!
//         </Typography>
//         <Typography variant="body1">
//           Thank you for visiting our website. We hope you have a great experience.
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default WelcomeCard;


// import { Card, Typography } from '@mui/material';

// const useStyles = makeStyles((theme) => ({
//   card: {
//     maxWidth: 500,
//     margin: '0 auto',
//     marginTop: theme.spacing(4),
//     backgroundColor: '#f9f9f9',
//     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
//     borderRadius: theme.spacing(2),
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: theme.spacing(3),
//   },
//   content: {
//     padding: theme.spacing(3),
//   },
// }));

// const WelcomeCard = () => {
//   const classes = useStyles();

//   return (
//     <Card className={classes.card}>
//       <Typography variant="h1" className={classes.title}>
//         Welcome!
//       </Typography>
//       <Typography variant="body1">
//         Thank you for visiting our website. We hope you have a great experience.
//       </Typography>
//     </Card>
//   );
// };

// export default WelcomeCard;

import { Card, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Welcome from '../../images/welcome2.jpg';

const CustomCard = styled(Card)(({ theme }) => ({
  maxWidth: '80%',
  margin: '0 auto',
  marginTop: theme.spacing(4),
  backgroundColor: '#f9f9f9',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  borderRadius: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
}));

const Content = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const WelcomeCard = (props) => {

  const username = sessionStorage.getItem('username');

  return (
    <CustomCard onClick={(e) => props.setValue(0)}>
      <Title variant="h1">
        Welcome {username}!
      </Title>
      <Content variant="body1">
        Thank you for visiting our website. We hope you have a great experience.
      </Content>
      <Content variant="body2">
        Book an Appointment by clicking here.
      </Content>
      <div style={{width: '100%'}}>
        <img src={Welcome} alt='Welcome' />
      </div>
    </CustomCard>
  );
};

export default WelcomeCard;

