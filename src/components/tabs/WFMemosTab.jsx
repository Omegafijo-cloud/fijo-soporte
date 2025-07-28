// components/tabs/WFMemosTab.jsx
'use client';

import React, { useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

// Define predefinedWFMemos here or import from a constants file
const predefinedWFMemos = {
    "migracion gpon": [{ label: "Tipo de reporte", type: "text", id: "wf_migracion_tipo_reporte" }, { label: "Acepta migración", type: "text", id: "wf_migracion_acepta_migracion" }, { label: "Factura Con", type: "text", id: "wf_migracion_factura_con" }, { label: "Titular del servicio", type: "text", id: "wf_migracion_titular" }, { label: "Contacto en sitio", type: "text", id: "wf_migracion_contacto_sitio" }, { label: "No. Contacto", type: "text", id: "wf_migracion_no_contacto" }, { label: "Dirección", type: "text", id: "wf_migracion_direccion" }, { label: "Horario de visita", type: "text", id: "wf_migracion_horario_visita" }, { label: "Comentario", type: "textarea", id: "wf_migracion_comentario" }],
    "inconvenientes con vpn": [{ label: "NUMERO DE SERVICIO", type: "text", id: "wf_vpn_num_servicio" }, { label: "Tipo de CPE", type: "text", id: "wf_vpn_tipo_cpe" }, { label: "MAC Cable Modem o CPE", type: "text", id: "wf_vpn_mac_cpe" }, { label: "Problema reportado", type: "text", id: "wf_vpn_problema_reportado" }, { label: "Nombre del cliente", type: "text", id: "wf_vpn_nombre_cliente" }, { label: "Tel Contacto", type: "text", id: "wf_vpn_tel_contacto" }, { label: "Nombre completo herramienta o aplicativo de vpn", type: "text", id: "wf_vpn_app_vpn" }, { label: "Puertos UDP y TCP que desee verificar", type: "text", id: "wf_vpn_puertos" }, { label: "Numero o nombre de error que da el aplicativo", type: "text", id: "wf_vpn_error_app" }, { label: "Si es VPN, hacía que IP intenta conectarse", type: "text", id: "wf_vpn_ip_conexion" }, { label: "MAC Address de la computadora", type: "text", id: "wf_vpn_mac_computadora" }, { label: "Pruebas(si se efectúan)", type: "textarea", id: "wf_vpn_pruebas" }, { label: "Comentario", type: "textarea", id: "wf_vpn_comentario" }],
    "filtrado mac": [{ label: "Problema reportado", type: "text", id: "wf_filtrado_problema" }, { label: "Número de Servicio", type: "text", id: "wf_filtrado_num_servicio" }, { label: "Nombre del cliente", type: "text", id: "wf_filtrado_nombre_cliente" }, { label: "Tel Contacto", type: "text", id: "wf_filtrado_tel_contacto" }, { label: "MAC Address", type: "text", id: "wf_filtrado_mac_address" }, { label: "Pruebas(si se efectúan)", type: "textarea", id: "wf_filtrado_pruebas" }, { label: "Comentario", type: "textarea", id: "wf_filtrado_comentario" }],
    "cita incumplida": [{ label: "No. Orden", type: "text", id: "wf_cita_no_orden" }, { label: "Nombre contacto", type: "text", id: "wf_cita_nombre_contacto" }, { label: "Numero de referencia", type: "text", id: "wf_cita_num_referencia" }, { label: "Fecha de visita", type: "text", id: "wf_cita_fecha_visita" }, { label: "Hora de visita", type: "text", id: "wf_cita_hora_visita" }, { label: "Gestor de Despacho que atendió la llamada", type: "text", id: "wf_cita_gestor_despacho" }, { label: "Orden", type: "text", id: "wf_cita_orden" }, { label: "tipo de orden", type: "text", id: "wf_cita_tipo_orden" }, { label: "tecnología", type: "text", id: "wf_cita_tecnologia" }, { label: "Región", type: "text", id: "wf_cita_region" }, { label: "fecha de nueva visita", type: "text", id: "wf_cita_nueva_visita" }, { label: "horario am/pm", type: "text", id: "wf_cita_horario" }, { label: "Nombre de cliente", type: "text", id: "wf_cita_nombre_cliente" }, { label: "Descripción", type: "textarea", id: "wf_cita_descripcion" }],
    "vencido comercial": [{ label: "Teléfono de referencia", type: "text", id: "wf_vencido_com_tel_ref" }, { label: "No. de O/S", type: "text", id: "wf_vencido_com_os" }, { label: "Comentarios", type: "textarea", id: "wf_vencido_com_comentarios" }, { label: "Hora visita", type: "text", id: "wf_vencido_com_hora_visita" }],
    "velocidad mal configurada": [{ label: "No. Contacto", type: "text", id: "wf_velocidad_no_contacto" }, { label: "Inconveniente reportado", type: "text", id: "wf_velocidad_inconveniente" }, { label: "Virtual Reportado", type: "text", id: "wf_velocidad_virtual_reportado" }, { label: "Velocidad Config PISA", type: "text", id: "wf_velocidad_pisa" }, { label: "Velocidad config UMP", type: "text", id: "wf_velocidad_ump" }],
    "vencido operaciones": [{ label: "Teléfono de referencia", type: "text", id: "wf_vencido_op_tel_ref" }, { label: "No. de O/S", type: "text", id: "wf_vencido_op_os" }, { label: "Comentarios", type: "textarea", id: "wf_vencido_op_comentarios" }, { label: "No. Queja", type: "text", id: "wf_vencido_op_queja" }, { label: "Hora visita", type: "text", id: "wf_vencido_op_hora_visita" }, { label: "Pruebas Realizadas", type: "textarea", id: "wf_vencido_op_pruebas" }],
    "locucion mora activa": [{ label: "Nombre de quien reporta", type: "text", id: "wf_mora_nombre_reporta" }, { label: "Número afectado", type: "text", id: "wf_mora_num_afectado" }, { label: "Tel de Ref", type: "text", id: "wf_mora_tel_ref" }, { label: "O/S generada", type: "text", id: "wf_mora_os_generada" }, { label: "Fecha de pago", type: "text", id: "wf_mora_fecha_pago" }, { label: "IVR", type: "text", id: "wf_mora_ivr" }, { label: "Observaciones", type: "textarea", id: "wf_mora_observaciones" }],
    "bloqueo mayor a 2 horas": [{ label: "Nombre de quien reporta", type: "text", id: "wf_bloqueo_nombre_reporta" }, { label: "Servicio a liberar", type: "text", id: "wf_bloqueo_servicio" }, { label: "No. afectado", type: "text", id: "wf_bloqueo_num_afectado" }, { label: "Tipo de bloqueo", type: "text", id: "wf_bloqueo_tipo" }, { label: "Tel de Ref", type: "text", id: "wf_bloqueo_tel_ref" }, { label: "Hora de Pago", type: "text", id: "wf_bloqueo_hora_pago" }, { label: "Reincidente", type: "text", id: "wf_bloqueo_reincidente" }, { label: "Comentarios", type: "textarea", id: "wf_bloqueo_comentarios" }],
    "daño a la infraestructura": [{ label: "Contacto", type: "text", id: "wf_infra_contacto" }, { label: "Teléfono de contacto", type: "text", id: "wf_infra_tel_contacto" }, { label: "Dirección de daño", type: "text", id: "wf_infra_direccion_dano" }, { label: "Daño que reporta", type: "textarea", id: "wf_infra_dano_reporta" }],
    "claro video": [{ label: "Nombre del Cliente", type: "text", id: "wf_clarovideo_nombre" }, { label: "Número telefónico", type: "text", id: "wf_clarovideo_telefono" }, { label: "Correo electrónico a registrar", type: "text", id: "wf_clarovideo_correo" }, { label: "Qué problema reporta", type: "textarea", id: "wf_clarovideo_problema" }, { label: "Fecha de nacimiento", type: "text", id: "wf_clarovideo_fecha_nac" }, { label: "Telefonos de contacto", type: "text", id: "wf_clarovideo_tels_contacto" }, { label: "Plataforma donde está tratando de registrarse", type: "text", id: "wf_clarovideo_plataforma" }],
    "reparación en tiempo vencido": [{ label: "Teléfono de referencia", type: "text", id: "wf_rep_venc_tel_ref" }, { label: "No. de O/S", type: "text", id: "wf_rep_venc_os" }, { label: "Comentarios", type: "textarea", id: "wf_rep_venc_comentarios" }, { label: "No. Queja", type: "text", id: "wf_rep_venc_queja" }, { label: "Hora visita", type: "text", id: "wf_rep_venc_hora_visita" }, { label: "Pruebas Realizadas", type: "textarea", id: "wf_rep_venc_pruebas" }],
    "mala atención al tecnico": [{ label: "Motivo", type: "text", id: "wf_mala_atencion_motivo" }, { label: "Número afectado", type: "text", id: "wf_mala_atencion_num_afectado" }, { label: "Nombre completo del cliente", type: "text", id: "wf_mala_atencion_nombre_cliente" }, { label: "Nombre de quien reporta", type: "text", id: "wf_mala_atencion_nombre_reporta" }, { label: "Teléfono de referencia", type: "text", id: "wf_mala_atencion_tel_ref" }, { label: "Fecha de solicitud", type: "text", id: "wf_mala_atencion_fecha_solicitud" }, { label: "Servicio contratado", type: "text", id: "wf_mala_atencion_servicio" }, { label: "Dirección de instalación", type: "text", id: "wf_mala_atencion_direccion" }, { label: "Descripción del reclamo", type: "textarea", id: "wf_mala_atencion_descripcion" }],
    "check en rojo": [{ label: "Número", type: "text", id: "wf_check_rojo_numero" }, { label: "Correo Claro Video", type: "text", id: "wf_check_rojo_correo" }, { label: "Plan o paquete contratado", type: "text", id: "wf_check_rojo_plan" }, { label: "Check con error en GUI", type: "text", id: "wf_check_rojo_error_gui" }, { label: "Número de contacto", type: "text", id: "wf_check_rojo_num_contacto" }, { label: "Cliente", type: "text", id: "wf_check_rojo_cliente" }, { label: "Descripción", type: "textarea", id: "wf_check_rojo_descripcion" }, { label: "Pruebas realizadas", type: "textarea", id: "wf_check_rojo_pruebas" }],
    "sin acceso a guía interactiva": [{ label: "Número", type: "text", id: "wf_guia_numero" }, { label: "Correo Claro Video", type: "text", id: "wf_guia_correo" }, { label: "Plan o paquete contratado", type: "text", id: "wf_guia_plan" }, { label: "Check AMCO y PLE", type: "text", id: "wf_guia_check_amco_ple" }, { label: "Mensaje que muestra TV", type: "text", id: "wf_guia_mensaje_tv" }, { label: "Número de contacto", type: "text", id: "wf_guia_num_contacto" }, { label: "Cliente", type: "text", id: "wf_guia_cliente" }, { label: "Descripción", type: "textarea", id: "wf_guia_descripcion" }, { label: "Pruebas realizadas", type: "textarea", id: "wf_guia_pruebas" }],
    "configuración wifi": [{ label: "Quien genera queja", type: "text", id: "wf_wifi_quien_queja" }, { label: "Luz Pon", type: "text", id: "wf_wifi_luz_pon" }, { label: "Luz Los", type: "text", id: "wf_wifi_luz_los" }, { label: "Serie", type: "text", id: "wf_wifi_serie" }, { label: "Canal dañado", type: "text", id: "wf_wifi_canal_danado" }, { label: "Problema reportado", type: "textarea", id: "wf_wifi_problema_reportado" }, { label: "Pruebas Realizadas", type: "textarea", id: "wf_wifi_pruebas_realizadas" }, { label: "Contacto en sitio", type: "text", id: "wf_wifi_contacto_sitio" }, { label: "Teléfonos de referencias", type: "text", id: "wf_wifi_tels_referencias" }, { label: "Dirección", type: "text", id: "wf_wifi_direccion" }],
    "reparación en plazo vigente": [{ label: "Teléfono de referencia", type: "text", id: "wf_reparacion_plazo_vigente_tel_ref" }, { label: "Comentarios", type: "textarea", id: "wf_reparacion_plazo_vigente_comentarios", defaultValue: "Seguimiento a queja en tiempo Vigente" }, { label: "No. Queja", type: "text", id: "wf_reparacion_plazo_vigente_no_queja" }, { label: "Hora visita", type: "text", id: "wf_reparacion_plazo_vigente_hora_visita", defaultValue: "8:00 a 5:00" }, { label: "Pruebas Realizadas", type: "textarea", id: "wf_reparacion_plazo_vigente_pruebas_realizadas", defaultValue: "Cl Indica que no ha llegado el técnico y le urge, por favor verificar." }],
    "otros wf": [{ label: "Nombre de contacto", type: "text", id: "wf_otros_nombre_contacto" }, { label: "Teléfonos de referencia", type: "text", id: "wf_otros_tels_referencia" }, { label: "Numero de orden y/o queja", type: "text", id: "wf_otros_num_orden_queja" }, { label: "Inconveniente del cliente", type: "textarea", id: "wf_otros_inconveniente_cliente" }, { label: "Pruebas Realizada", type: "textarea", id: "wf_otros_pruebas_realizadas" }]
};

export default function WFMemosTab() {
    const { appData, updateWFMemosData, setAlert, setConfirm } = useContext(AppStateContext);
    const { selectedType, fields } = appData.wfMemosData;

    const handleSelectChange = useCallback((value) => {
        updateWFMemosData('selectedType', value);
        updateWFMemosData('fields', {}); // Clear fields when changing type
    }, [updateWFMemosData]);

    const renderFormFields = useCallback(() => {
        const templateFields = predefinedWFMemos[selectedType] || [];
        return templateFields.map(field => {
            const InputComponent = field.type === 'textarea' ? Textarea : Input;
            return (
                <div key={field.id} className="mb-6">
                    <Label htmlFor={field.id} className="block text-lg font-medium text-gray-700 mb-2">
                        {field.label}
                    </Label>
                    <InputComponent
                        id={field.id}
                        placeholder={field.label}
                        value={fields[field.id] || field.defaultValue || ''}
                        onChange={(e) => updateWFMemosData('fields', { ...fields, [field.id]: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
                        rows={field.type === 'textarea' ? 4 : undefined}
                    />
                </div>
            );
        });
    }, [selectedType, fields, updateWFMemosData]);

    const handleCopyWFMemos = useCallback(() => {
        let content = `ASUNTO: ${selectedType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
        const templateFields = predefinedWFMemos[selectedType] || [];
        templateFields.forEach(field => {
            content += `${field.label}: ${fields[field.id] || '(Sin valor)'}\n`;
        });
        copyToClipboard(content.trim(), 'Memo de WF copiado.', setAlert);
    }, [selectedType, fields, setAlert]);

    const handleClearWFMemos = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar el memo de WF?',
            onConfirm: () => {
                updateWFMemosData('selectedType', '');
                updateWFMemosData('fields', {});
            },
        });
    }, [setConfirm, updateWFMemosData]);

    return (
        <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-2xl">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    MEMOS DE WF
                </h3>
                <div className="mb-6">
                    <Label htmlFor="wfMemosDropdown" className="block text-lg font-medium text-gray-700 mb-2">Seleccione Plantilla WF</Label>
                    <Select value={selectedType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200">
                            <SelectValue placeholder="-- Seleccione Plantilla WF --" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(predefinedWFMemos).map(key => (
                                <SelectItem key={key} value={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedType && (
                    <div className="mt-6 pt-6 border-t border-dashed border-purple-300">
                        {renderFormFields()}
                        <div className="flex justify-start gap-4 mt-8">
                            <Button onClick={handleCopyWFMemos} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                                Copiar Memo WF
                            </Button>
                            <Button onClick={handleClearWFMemos} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                                Limpiar Memo WF
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
