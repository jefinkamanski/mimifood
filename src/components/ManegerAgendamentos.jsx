import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, remove, onChildAdded } from "firebase/database";
import { db } from '../database/conectFirebase';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import Grid from '@mui/system/Unstable_Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { LinearWithValueLabel } from '../services/LinearWithValueLabel';
import { blue } from '@mui/material/colors';

const azul = blue[600];

function AgendamentosManeger() {

  const [Agendamentos, setAgendamentos] = useState([]);
  const [Configuracoes, setConfiguracoes] = useState([]);
  const [Nome, setNome] = useState('');


  useEffect(() => {

    const databaseRef = ref(db, 'agendamentos');

    const onDataChange = snapshot => {
      // O callback será chamado sempre que os dados no caminho especificado mudarem
      setAgendamentos({
        ...snapshot.val(),
      });
    };

    // Adicione um listener para escutar as alterações nos dados
    onValue(databaseRef, onDataChange);

    // Retorne uma função de limpeza para remover o listener quando o componente for desmontado
    return () => {
      onValue(databaseRef, onDataChange);
    };
  }, []);

  useEffect(() => {
    const configuracaoRef = ref(db, "configuracoes");
    try {
      onChildAdded(configuracaoRef, (snapshot) => {
        const configuracao = snapshot.val();
        const id = snapshot.key;
        setConfiguracoes((prevData) => ({
          ...prevData,
          [id]: configuracao,
        }));
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      setConfiguracoes({});
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Configuracoes) {
          const configuracoesArray = Object.values(Configuracoes);
          const result = configuracoesArray[configuracoesArray.length - 1];
          setNome(result.nome);
        } 
      } catch (error) {
        console.log(error);
        return () => {
          setNome('');
        };
      }
    }

    if (Object.keys(Configuracoes).length > 0) {
      fetchData();
    }

  }, [Configuracoes]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure wanted to delete this record?")) {
      const db = getDatabase();
      const contactsRef = ref(db, `agendamentos/${id}`);

      remove(contactsRef)
        .then(() => {
          console.log("User deleted successfully");
          toast.success("User deleted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  const porcaoGetTime = async function () {
    console.log('acionou')
  }

  return (
    <span>
      <Grid container spacing={1}>
        <Grid xs={8}>
          <Box sx={{ width: '100%', margin: '16px 0 0 0' }}>
            <Typography variant="h6" color="white" component="div">
              Estoque Disponivel
            </Typography>
            <LinearWithValueLabel />
          </Box>
        </Grid>
        <Grid xs={4}>
          <Box sx={{ width: '100%', margin: '32px 0 0 0' }}>
            <Button onClick={(e) => porcaoGetTime(e)} sx={{ borderColor: azul, border: 2 }} variant="outlined">1 Porção</Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} mt={2} mb={2}>
          {Object.keys(Agendamentos).map((id) => {
            return (
              <Grid key={id} xs={12} md={4}>
                <Card sx={{ marginButton: 16 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid xs={12}>
                        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                          {Agendamentos[id].nome} DA {Nome}
                          {/* {nome}  */}
                        </Typography>
                      </Grid>
                      <Grid xs={8}>
                        <Typography variant="h5" color="text.secondary">
                          Hora
                        </Typography>
                        <Typography variant="h3">
                          <span className="time" >{Agendamentos[id].agendamento ? Agendamentos[id].agendamento.substring(0,5) : '00:00'} </span>
                        </Typography>
                      </Grid>

                      <Grid xs={2}>
                        <Typography variant="h5" color="text.secondary">
                          Porções
                        </Typography>
                        <Typography variant="h3">
                          {Agendamentos[id].porcoes}
                        </Typography>
                      </Grid>

                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <IconButton href={(`/novo-agendamento/${id}`)} aria-label="Editar">
                      <EditIcon />
                      <Typography sx={{ fontSize: 16, marginLeft: 1 }} color="text.primary">
                        Editar
                      </Typography>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={handleDelete.bind(this, id)} aria-label="Delete">
                      <DeleteIcon />
                      <Typography sx={{ fontSize: 16, marginLeft: 1 }} color="text.primary">
                        Excluir
                      </Typography>
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>

            )
          })}
        </Grid>
      </Box>
    </span>
  )
}

export { AgendamentosManeger }