import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

/**
 * Converte o formato dos erros encontrados na validação do Yup para uma coleção
 * de campos relacionados com a mensagem de erro.
 *
 * @param error objeto com os erros encontrados na validação
 */
export function extractValidationMessages(error: ValidationError): Errors {
  const errors: Errors = {};

  error.inner.forEach(validationError => {
    errors[validationError.path] = validationError.message;
  });

  return errors;
}
