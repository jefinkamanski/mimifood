import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ref, onValue } from "firebase/database";
import { db } from '../database/conectFirebase';



function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {

    const databaseRef = ref(db, 'estoque');

    const onDataChange = snapshot => {
      // const newDataArray = newData ? Object.entries(newData) : [];
      setProgress(snapshot.val());
    };

    // Adicione um listener para escutar as alterações nos dados
    onValue(databaseRef, onDataChange);

    // Retorne uma função de limpeza para remover o listener quando o componente for desmontado
    return () => {
      onValue(databaseRef, onDataChange);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}