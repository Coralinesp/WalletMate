import supabase from '../back/supabase'

//Funciones para tabla Gestion de ingresos
export async function getGestionDeIngresos() {
  const { data, error } = await supabase
    .from('GestionDeIngresos')
    .select('*')
  if (error) throw error
  return data
}

export async function createGestionDeIngreso({ tipoDeIngreso, descripcion, usuario, estado }) {
  const { data, error } = await supabase
    .from('GestionDeIngresos')
    .insert([{ 
      TipoDeIngreso: tipoDeIngreso,
      Descripcion: descripcion,
      Usuario: usuario,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateGestionDeIngreso(id, { tipoDeIngreso, descripcion, usuario, estado }) {
  const { data, error } = await supabase
    .from('GestionDeIngresos')
    .update({
      TipoDeIngreso: tipoDeIngreso,
      Descripcion: descripcion,
      Usuario: usuario,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteGestionDeIngreso(id) {
  const { data, error } = await supabase
    .from('GestionDeIngresos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}

//Funciones para tabla gestion de egresos
export async function getGestionDeEgresos() {
  const { data, error } = await supabase
    .from('GestionDeEgresos')
    .select('*')
  if (error) throw error
  return data
}

export async function createGestionDeEgreso({
  tipoDeEgreso,
  renglonDeEgreso,
  tipoDePagoxDefecto,
  descripcion,
  estado
}) {
  const { data, error } = await supabase
    .from('GestionDeEgresos')
    .insert([{
      TipoDeEgreso: tipoDeEgreso,
      RenglonDeEgreso: renglonDeEgreso,
      TipoDePagoxDefecto: tipoDePagoxDefecto,
      Descripcion: descripcion,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateGestionDeEgreso(id, {
  tipoDeEgreso,
  renglonDeEgreso,
  tipoDePagoxDefecto,
  descripcion,
  estado
}) {
  const { data, error } = await supabase
    .from('GestionDeEgresos')
    .update({
      TipoDeEgreso: tipoDeEgreso,
      RenglonDeEgreso: renglonDeEgreso,
      TipoDePagoxDefecto: tipoDePagoxDefecto,
      Descripcion: descripcion,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteGestionDeEgreso(id) {
  const { data, error } = await supabase
    .from('GestionDeEgresos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}

//Funciones para renglones de egresos
export async function getRenglonesDeEgresos() {
  const { data, error } = await supabase
    .from('RenglonesDeEgresos')
    .select('*')
  if (error) throw error
  return data
}

export async function createRenglonDeEgreso({ descripcion, estado }) {
  const { data, error } = await supabase
    .from('RenglonesDeEgresos')
    .insert([{
      Descripcion: descripcion,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateRenglonDeEgreso(id, { descripcion, estado }) {
  const { data, error } = await supabase
    .from('RenglonesDeEgresos')
    .update({
      Descripcion: descripcion,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteRenglonDeEgreso(id) {
  const { data, error } = await supabase
    .from('RenglonesDeEgresos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
 //funciones para tipos de egresos
 export async function getTiposDeEgresos() {
  const { data, error } = await supabase
    .from('TiposDeEgresos')
    .select('*')
  if (error) throw error
  return data
}

export async function createTipoDeEgreso({ descripcion, estado }) {
  const { data, error } = await supabase
    .from('TiposDeEgresos')
    .insert([{
      Descripcion: descripcion,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateTipoDeEgreso(id, { descripcion, estado }) {
  const { data, error } = await supabase
    .from('TiposDeEgresos')
    .update({
      Descripcion: descripcion,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteTipoDeEgreso(id) {
  const { data, error } = await supabase
    .from('TiposDeEgresos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
//funciones para tipos de ingresos
export async function getTiposDeIngresos(id_user) {
  const { data, error } = await supabase
    .from('TiposDeIngresos')
    .select('*')
    .eq('id_user', id_user);
  if (error) throw error;
  return data;
}

export async function createTipoDeIngreso({ descripcion, estado, id_user }) {
  const { data, error } = await supabase
    .from('TiposDeIngresos')
    .insert([{
      Descripcion: descripcion,
      Estado: estado,
      id_user: id_user // <-- Agrega el id_user aquí
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateTipoDeIngreso(id, { descripcion, estado }) {
  const { data, error } = await supabase
    .from('TiposDeIngresos')
    .update({
      Descripcion: descripcion,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteTipoDeIngreso(id) {
  const { data, error } = await supabase
    .from('TiposDeIngresos')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
//funciones para tipos de pago
export async function getTiposDePago() {
  const { data, error } = await supabase
    .from('TiposDePago')
    .select('*')
  if (error) throw error
  return data
}

export async function createTipoDePago({ descripcion, estado }) {
  const { data, error } = await supabase
    .from('TiposDePago')
    .insert([{
      Descripcion: descripcion,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateTipoDePago(id, { descripcion, estado }) {
  const { data, error } = await supabase
    .from('TiposDePago')
    .update({
      Descripcion: descripcion,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteTipoDePago(id) {
  const { data, error } = await supabase
    .from('TiposDePago')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
//funciones para usuario
export async function getUsuarios() {
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
  if (error) throw error
  return data
}

export async function createUsuario({ nombre, cedula, limiteDeEgresos, tipoPersona, fechaDeCorte, estado }) {
  const { data, error } = await supabase
    .from('Usuarios')
    .insert([{
      Nombre: nombre,
      Cedula: cedula,
      LimiteDeEgresos: limiteDeEgresos,
      TipoPersona: tipoPersona,
      FechaDeCorte: fechaDeCorte,
      Estado: estado
    }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateUsuario(id, { nombre, cedula, limiteDeEgresos, tipoPersona, fechaDeCorte, estado }) {
  const { data, error } = await supabase
    .from('Usuarios')
    .update({
      Nombre: nombre,
      Cedula: cedula,
      LimiteDeEgresos: limiteDeEgresos,
      TipoPersona: tipoPersona,
      FechaDeCorte: fechaDeCorte,
      Estado: estado
    })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteUsuario(id) {
  const { data, error } = await supabase
    .from('Usuarios')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
