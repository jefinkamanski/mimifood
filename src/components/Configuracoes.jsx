import * as React from 'react';
import { useState, useEffect } from 'react'
import { push, ref, set, onChildAdded } from 'firebase/database';
import { db } from '../database/conectFirebase';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { Loader } from '../services/loader';



function Configuracoes() {
  const navigate = useNavigate();

  const initialState = {
    nome: '',
    tamanhoPorcao: 0,
    tempoSom: 0
  };

  const [carregando, setCarregando] = useState(true);
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const [id, setId] = useState(0);
  const [nome, setNome] = useState("");
  const [tamanhoPorcao, setTamanhoPorcao] = useState(0);
  const [tempoSom, setTempoSom] = useState(0);


  useEffect(() => {
    const configuracaoRef = ref(db, "configuracoes");
    try {
      onChildAdded(configuracaoRef, (snapshot) => {
        const configuracao = snapshot.val();
        const id = snapshot.key;
        setData((prevData) => ({
          ...prevData,
          [id]: configuracao,
        }));
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      setData({});
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data) {
          const configuracoesArray = Object.values(data);
          const result = configuracoesArray[configuracoesArray.length - 1];
          setNome(result.nome);
          setTamanhoPorcao(result.tamanhoPorcao);
          setTempoSom(result.tempoSom);
          setId(Object.keys(data).pop());
        } else {
          setState({ ...initialState });
        }
        setTimeout(() => setCarregando(false), 1000);
      } catch (error) {
        console.log(error);
        return () => {
          setState({ ...initialState });
        };
      }
    }
    if (Object.keys(data).length > 0) {
      fetchData();
    }

  }, [data]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nome || !tamanhoPorcao || !tempoSom) {
      toast.error("Por favor, prencha todas as informações!");
    } else {
      try {
        const state = { nome, tamanhoPorcao, tempoSom };
        if (!id) {
          // No id mean user is adding record for the first time
          push(ref(db, "configuracoes"), state, (err) => {
            if (err) {
              toast.error(err);
            } else {
              toast.success("configuracoes incluido com Sucesso!");
            }
          });
        } else {
          set(ref(db, `configuracoes/${id}`), state, (err) => {
            if (err) {
              toast.error(err);
            } else {
              toast.success("configuracoes atualizado com Sucesso!");
            }
          });
        }

        setTimeout(() => navigate('/'), 500);
      } catch (err) {
        console.error(err);
      }
    }
  }


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
            <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth type='text' id="nome" label="Nome do Cat" variant="outlined"
                    onChange={(e) => setNome(e.target.value.toUpperCase())} value={nome} required autoFocus />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type='number' id="tamanhoPorcao" label="Tamanho da Porção" variant="outlined"
                    onChange={(e) => setTamanhoPorcao(e.target.value)} value={tamanhoPorcao} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type='number' id="tempoAlarme" label="Tempo do Alarme" variant="outlined"
                    onChange={(e) => setTempoSom(e.target.value)} value={tempoSom} required />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth type='submit' sx={{ mt: 3, mb: 2 }}>Salvar Configurações</Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

export { Configuracoes }