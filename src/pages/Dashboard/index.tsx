import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TODO LOAD FOODS OK
      if (foods.length <= 0) {
        console.log(`este`);
        const response = await api.get('/foods');
        setFoods(response.data);
      }
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API OK

      const addedFood = {
        ...food,
        available: true,
      };

      const response = await api.post(`/foods`, addedFood);

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API OK
    const { id, available } = editingFood;
    await api.put(`/foods/${id}`, food);

    const updatedFoods = [...foods];

    const updatedFoodIndex = updatedFoods.findIndex(
      updatedFood => updatedFood.id === id,
    );

    updatedFoods[updatedFoodIndex] = {
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      id,
      available,
    };

    setFoods(updatedFoods);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API OK
    await api.delete(`/foods/${id}`);
    const updatedFoods = foods.filter(food => food.id !== id);

    setFoods(updatedFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE OK
    toggleEditModal();
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
