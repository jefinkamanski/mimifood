import * as React from 'react';
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../database/conectFirebase';
import { push, ref, set, onValue } from 'firebase/database';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Loader } from '../services/loader';
import { format, parse } from 'date-fns';
import { FaCat } from 'react-icons/fa';
import { FaBowlRice } from 'react-icons/fa6';
import { BiSolidTimeFive } from 'react-icons/bi';


function AddAgendamento() {
  const initialState = {
    nome: "",
    agendamento: null,
    porcoes: ""
  };

  const [formatoHora, setformatoHora] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [data, setData] = useState({});
  const [state, setState] = useState(initialState);
  const [nome, setNome] = useState("");
  const [porcoes, setPorcoes] = useState("");
  const [agendamento, setAgendamento] = useState(null);

  const history = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    const agendamentosRef = ref(db, "agendamentos");

    const unsubscribe = onValue(agendamentosRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({
          ...snapshot.val(),
        });
      } else {
        setData({});
      }
    });
    return () => {
      unsubscribe();
      setData({});
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const result = { ...data[id] }
          setNome(result.nome);
          setPorcoes(result.porcoes);
          const agd = result.agendamento
          const agenda = parse(agd, 'HH:mm:ss', new Date());
          setAgendamento(agenda.getTime());
        } else {
          setState({ ...initialState });
        }
        setTimeout(() => setCarregando(false), 1000);
        return () => {
          setState({ ...initialState });
        };
      } catch (error) {
        console.log(error);
      }
    }
    if (Object.keys(data).length > 0) {
      fetchData();
    }
  }, [id, data]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !agendamento || !porcoes) {
      toast.error("Por favor, prencha todas as informações!");
    } else {
      var formattedDate = ''
      if (!formatoHora) {
        formattedDate = format(new Date(agendamento), "HH:mm:ss");
      } else {
        formattedDate = agendamento;
      }
      const state = { nome, agendamento: formattedDate, porcoes };
      console.log(state);

      if (!id) {
        // No id mean user is adding record for the first time
        push(ref(db, "agendamentos"), state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Agendamento incluido com Sucesso!");
          }
        });
      } else {
        set(ref(db, `agendamentos/${id}`), state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Agendamento atualizado com Sucesso!");
          }
        });
      }
      setTimeout(() => history("/"), 500);
    }
  };

  const handleTimeChange = (time) => {

    setformatoHora(true);
    const formattedDate = format(new Date(time), "HH:mm:ss");
    setAgendamento(formattedDate);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: 'grid',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {carregando ? (
          <Loader />
        ) : (
          <>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item xs={2} >
                    <FaCat size={28}  />
                </Grid>
                <Grid item xs={10}>
                  <TextField fullWidth type='text' id="agendamento" label="Titulo do Agendamento" variant="outlined"
                    onChange={(e) => setNome(e.target.value.toUpperCase())}
                    value={nome}
                    required autoFocus />
                </Grid>
                <Grid item xs={2} >
                    <FaBowlRice size={28}  />
                </Grid>
                <Grid item xs={10}>
                  <TextField fullWidth type='number' id="porcoes" label="Quantas Porções?" variant="outlined"
                    onChange={(e) => setPorcoes(e.target.value)} value={porcoes}
                    required />
                </Grid>
                <Grid item xs={2} >
                    <BiSolidTimeFive size={28}  />
                </Grid>
                <Grid item xs={10} >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker fullWidth
                      defaultValue={dayjs('2022-04-17T15:30')}
                      label='Horario do Agendamento' variant="outlined"
                      value={agendamento != null ? dayjs(agendamento) : agendamento} onChange={(e) => handleTimeChange(e)}

                      // renderInput={(props) => <TextField {...props} />}
                      componentsProps={{
                        actionBar: { actions: ["accept"] }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>

                  <Button variant="contained" fullWidth type='submit' value={id ? "Update" : "Save"} sx={{ mt: 3, mb: 2 }}>Agendar</Button>
                </Grid>
              </Grid>
            </Box>

          </>
        )}
      </Box>
    </Container>
  )
}

export { AddAgendamento }