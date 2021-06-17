import { Especialista } from "../especialista/especialista";
import { EspecialidadHorarios } from "./especialidad-horarios";

export class Horario {
    id: any;
    especialista: Especialista;
    especialidadHorarios: Array<EspecialidadHorarios> = [];
}