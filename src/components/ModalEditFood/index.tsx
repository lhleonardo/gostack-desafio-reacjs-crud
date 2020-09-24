import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import * as yup from 'yup';
import { extractValidationMessages } from '../../utils/ValidatorMessages';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  price: yup
    .number()
    .min(0, 'Deve ter um preço com valor positivo.')
    .required('O preço é obrigatório'),
  description: yup.string().required('A descrição da comida é obrigatória'),
  image: yup
    .string()
    .url('Precisa ser uma URL válida')
    .required('A foto de ilustração é obrigatória'),
});

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
      try {
        await schema.validate(data, { abortEarly: false });

        handleUpdateFood(data);

        setIsOpen();
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          // preencher os erros nos campos apropriados
          const errors = extractValidationMessages(err);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
