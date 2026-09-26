import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { Package, ShieldCheck, UserCheck, DollarSign } from 'lucide-react';

export default function Recepcion() {
    const [datosConfig, setDatosConfig] = useState({
        ciudades: [],
        formasEnvio: [],
        tiposEncomienda: [],
        modalidadesPago: [],
        tarifas: []
    });

    const [form, setForm] = useState({
        ci_remitente: '',
        ci_destinatario: '',
        id_origen: '',
        id_destino: '',
        id_forma_envio: '',
        id_tipo_encomienda: '',
        id_modalidad_pago: '',
        peso: '',
        dimensiones: '',
        recargo_volumen: '',
        declaracion_legal: false
    });

    // Datos autocompletados de clientes encontrados
    const [remitenteEncontrado, setRemitenteEncontrado] = useState<any>(null);
    const [destinatarioEncontrado, setDestinatarioEncontrado] = useState<any>(null);

    // Resultado al registrar con éxito
    const [resultadoExito, setResultadoExito] = useState<any>(null);

    useEffect(() => {
        const cargarConfiguracion = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/encomiendas/config');
                setDatosConfig(res.data);
            } catch (error) {
                console.error('Error al cargar la configuración de recepción');
            }
        };
        cargarConfiguracion();
    }, []);

    // Buscar Remitente por CI
    const buscarRemitente = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/clientes/${form.ci_remitente}`);
            setRemitenteEncontrado(res.data);
        } catch (error) {
            alert('Remitente no encontrado. Debe registrarlo primero en el módulo de Clientes.');
            setRemitenteEncontrado(null);
        }
    };

    // Buscar Destinatario por CI
    const buscarDestinatario = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/api/clientes/${form.ci_destinatario}`);
            setDestinatarioEncontrado(res.data);
        } catch (error) {
            alert('Destinatario no encontrado. Debe registrarlo primero en el módulo de Clientes.');
            setDestinatarioEncontrado(null);
        }
    };

    // Buscar tarifa correspondiente según los selectores
    const tarifaAplicable = datosConfig.tarifas.find((t: any) =>
        t.id_origen.toString() === form.id_origen &&
        t.id_destino.toString() === form.id_destino &&
        t.id_forma_envio.toString() === form.id_forma_envio &&
        t.id_tipo_encomienda.toString() === form.id_tipo_encomienda
    );

    // Calcular precio estimado en pantalla (multiplicando peso por tarifa base)
    const esSobre = form.id_tipo_encomienda === '1';

    // Calcular precio estimado en pantalla incluyendo el recargo
    const calcularTotal = () => {
        if (!tarifaAplicable || !form.peso) return '0.00';
        const costoBase = parseFloat(form.peso) * parseFloat((tarifaAplicable as any).precio_base_kilo);
        // Si es sobre, el recargo es 0; si no, toma lo que digitó el empleado
        const recargo = esSobre ? 0 : (parseFloat(form.recargo_volumen) || 0);
        return (costoBase + recargo).toFixed(2);
    };
    const precioEstimado = calcularTotal();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!remitenteEncontrado || !destinatarioEncontrado) {
            alert('Debe verificar y validar los carnets del remitente y destinatario.');
            return;
        }
        if (!tarifaAplicable) {
            alert('No existe una tarifa configurada para esta ruta y modalidad.');
            return;
        }
        if (!form.declaracion_legal) {
            alert('Debe marcar la casilla de verificación legal de contenido.');
            return;
        }

        try {
            const idEmpleadoLogueado = localStorage.getItem('id_empleado') || '1';

const payload = {
    id_remitente: remitenteEncontrado.cliente?.id_persona || remitenteEncontrado.id_persona,
    id_destinatario: destinatarioEncontrado.cliente?.id_persona || destinatarioEncontrado.id_persona,
    id_tarifa: (tarifaAplicable as any).id_tarifa,
    id_modalidad_pago: form.id_modalidad_pago,
    peso: form.peso,
    dimensiones: esSobre ? '' : form.dimensiones,
    recargo_volumen: esSobre ? 0 : (parseFloat(form.recargo_volumen) || 0), 
    declaracion_legal: form.declaracion_legal ? 1 : 0,
    id_empleado: idEmpleadoLogueado // <-- Aquí llamas a la variable, eliminando la advertencia
};

            const res = await axios.post('http://localhost:3001/api/encomiendas', payload);
            setResultadoExito(res.data);
            alert(`¡Encomienda registrada con éxito! Guía: ${res.data.codigo_guia}`);

            // Limpiar formulario
            setForm({
                ci_remitente: '', ci_destinatario: '', id_origen: '', id_destino: '',
                id_forma_envio: '', id_tipo_encomienda: '', id_modalidad_pago: '',
                peso: '', dimensiones: '', recargo_volumen: '', declaracion_legal: false
            });
            setRemitenteEncontrado(null);
            setDestinatarioEncontrado(null);

        } catch (error: any) {
            alert(error.response?.data?.mensaje || 'Error al procesar la encomienda');
        }
    };

    const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={28} /> Recepción y Tarificación de Encomiendas
            </h2>

            {resultadoExito && (
                <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#166534' }}>¡Guía Generada Exitosamente!</h3>
                    <p style={{ margin: 0, fontSize: '16px' }}>Código de Guía Oficial: <strong>{resultadoExito.codigo_guia}</strong></p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Monto Total Consolidado: <strong>Bs. {resultadoExito.monto_total}</strong></p>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                {/* SECCIÓN 1: CLIENTES (HU4) */}
                <h3 style={{ fontSize: '18px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                    1. Identificación de Actores (Remitente y Destinatario)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>CI Remitente</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" style={inputStyle} placeholder="Ingrese CI" value={form.ci_remitente} onChange={e => setForm({ ...form, ci_remitente: e.target.value })} required />
                            <button type="button" onClick={buscarRemitente} style={{ padding: '0 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Buscar</button>
                        </div>
                        {remitenteEncontrado && (
                            <p style={{ fontSize: '13px', color: '#16a34a', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <UserCheck size={14} /> {remitenteEncontrado.cliente?.nombre_completo || remitenteEncontrado.nombre_completo || 'Cliente Encontrado'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>CI Destinatario</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" style={inputStyle} placeholder="Ingrese CI" value={form.ci_destinatario} onChange={e => setForm({ ...form, ci_destinatario: e.target.value })} required />
                            <button type="button" onClick={buscarDestinatario} style={{ padding: '0 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Buscar</button>
                        </div>
                        {destinatarioEncontrado && (
                            <p style={{ fontSize: '13px', color: '#16a34a', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <UserCheck size={14} /> {destinatarioEncontrado.cliente?.nombre_completo || destinatarioEncontrado.nombre_completo || 'Cliente Encontrado'}
                            </p>
                        )}
                    </div>
                </div>

                {/* SECCIÓN 2: RUTA Y MODALIDAD (HU5) */}
                <h3 style={{ fontSize: '18px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                    2. Ruta, Encomienda y Tarifas
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Ciudad Origen</label>
                        <select style={inputStyle} value={form.id_origen} onChange={e => setForm({ ...form, id_origen: e.target.value })} required>
                            <option value="">Seleccione...</option>
                            {datosConfig.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Ciudad Destino</label>
                        <select style={inputStyle} value={form.id_destino} onChange={e => setForm({ ...form, id_destino: e.target.value })} required>
                            <option value="">Seleccione...</option>
                            {datosConfig.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Forma de Envío</label>
                        <select style={inputStyle} value={form.id_forma_envio} onChange={e => setForm({ ...form, id_forma_envio: e.target.value })} required>
                            <option value="">Seleccione...</option>
                            {datosConfig.formasEnvio.map((f: any) => <option key={f.id_forma_envio} value={f.id_forma_envio}>{f.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Tipo de Encomienda</label>
                        <select style={inputStyle} value={form.id_tipo_encomienda} onChange={e => setForm({ ...form, id_tipo_encomienda: e.target.value })} required>
                            <option value="">Seleccione...</option>
                            {datosConfig.tiposEncomienda.map((t: any) => <option key={t.id_tipo_encomienda} value={t.id_tipo_encomienda}>{t.nombre}</option>)}
                        </select>
                    </div>
                </div>

                {/* SECCIÓN 3: PESO, VOLUMEN Y PAGO */}
                <h3 style={{ fontSize: '18px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                    3. Peso, Volumen y Pago
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Peso (Kg)</label>
                        <input type="number" step="0.1" style={inputStyle} placeholder="0.0" value={form.peso} onChange={e => setForm({ ...form, peso: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Dimensiones (Volumen)</label>
                        <input
                            type="text"
                            style={{ ...inputStyle, backgroundColor: esSobre ? '#f1f5f9' : '#fff' }}
                            placeholder={esSobre ? 'No aplica para sobres (NULL)' : 'Ej: 30x20x10 cm'}
                            value={esSobre ? '' : form.dimensiones}
                            onChange={e => setForm({ ...form, dimensiones: e.target.value })}
                            disabled={esSobre}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Recargo por Volumen (Bs.)</label>
                        <input
                            type="number"
                            step="0.10"
                            style={{ ...inputStyle, backgroundColor: esSobre ? '#f1f5f9' : '#fff' }}
                            placeholder={esSobre ? 'No aplica (0.00)' : 'Ej: 15.50'}
                            value={esSobre ? '' : form.recargo_volumen}
                            onChange={e => setForm({ ...form, recargo_volumen: e.target.value })}
                            disabled={esSobre}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Modalidad de Pago</label>
                        <select style={inputStyle} value={form.id_modalidad_pago} onChange={e => setForm({ ...form, id_modalidad_pago: e.target.value })} required>
                            <option value="">Seleccione...</option>
                            {datosConfig.modalidadesPago.map((m: any) => (
                                <option key={m.id_modalidad} value={m.id_modalidad}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resumen de cobro en tiempo real */}
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                        <DollarSign size={20} color="#16a34a" />
                        <span>Tarifa Aplicada: <strong>{tarifaAplicable ? `Bs. ${(tarifaAplicable as any).precio_base_kilo} / Kg` : 'Seleccione ruta válida'}</strong></span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                        Total Estimado: Bs. {precioEstimado}
                    </div>
                </div>

                {/* SECCIÓN 4: AUDITORÍA LEGAL */}
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '6px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                        type="checkbox"
                        id="declaracion"
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        checked={form.declaracion_legal}
                        onChange={e => setForm({ ...form, declaracion_legal: e.target.checked })}
                        required
                    />
                    <label htmlFor="declaracion" style={{ fontSize: '14px', color: '#1e3a8a', cursor: 'pointer', fontWeight: '500' }}>
                        <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
                        Verificación Legal: Certifico que el contenido de la encomienda no contiene productos prohibidos por ley y asumo total responsabilidad.
                    </label>
                </div>

                <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                    Emitir Guía y Procesar Encomienda
                </button>

            </form>
        </div>
    );
}