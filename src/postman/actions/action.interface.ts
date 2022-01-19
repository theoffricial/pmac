// importPmacOra from '../pmac-ora'
// import inquirer from 'inquirer'

export interface IPmacAction<T = any> {
  //   constructor(pmacOra:PmacOra, _inquirer: typeof inquirer): any;
  run(): Promise<{ [key: string]: T }>;
}
