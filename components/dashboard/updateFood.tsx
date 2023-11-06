import { FormEvent } from 'react';

import axios from 'axios';
import { useSWRConfig } from 'swr';

import { toast } from 'react-toastify';
import type { food } from '@prisma/client';

type FormData = {
  target: {
    name: { value: string };
    image: { value: string };
    deliverable: { value: string };
    tags: { value: string };
    cheeseometer: { value: string };
    effort: { value: string };
  };
};

const UpdateFood = ({ food }: { food: food }) => {
  const { mutate } = useSWRConfig();

  async function saveFood(e: FormEvent<HTMLFormElement> & FormData) {
    e.preventDefault();

    const res = await axios.put('/api/food/update/' + food.id, {
      name: e.target.name.value,
      image: e.target.image.value,
      deliverable: e.target.deliverable.value === 'true' ? true : false,
      tags: e.target.tags.value,
      cheeseometer: Number(e.target.cheeseometer.value),
      effort: Number(e.target.effort.value),
    });

    if (res.status !== 200) {
      toast.error(
        `Failed updating '${e.target.name.value}': ${res.statusText}`
      );
      return;
    }

    toast.success(`Updated '${e.target.name.value}'`);
    mutate('/api/food');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document.querySelector(`#update${food.name}Dialog`) as any).checked =
      false;
  }

  return (
    <>
      <label
        htmlFor={`update${food.name}Dialog`}
        className="mt-1 mr-2 text-white bg-orange-600 border-none btn hover:bg-orange-700 modal-button ring-orange-400 hover:ring-4">
        Update
      </label>
      <input
        type="checkbox"
        id={`update${food.name}Dialog`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="relative w-full max-w-xs bg-white modal-box dark:bg-gray-700">
          <label
            htmlFor={`update${food.name}Dialog`}
            className="absolute bg-white border-none hover:bg-white hover:dark:bg-gray-700 btn btn-sm btn-circle right-4 top-4 dark:bg-gray-700">
            ✕
          </label>
          <h3 className="text-lg font-bold text-black dark:text-white">
            Create food
          </h3>
          <form
            className="flex flex-col"
            onSubmit={(e) =>
              saveFood(e as FormEvent<HTMLFormElement> & FormData)
            }>
            <label
              className="mt-2 mb-1 mr-2 text-black dark:text-white"
              htmlFor="name">
              Name
            </label>
            <input
              type="text"
              required
              name="name"
              id="name"
              maxLength={30}
              defaultValue={food.name}
              placeholder="Enter name"
              className="w-full max-w-xs text-black placeholder-black bg-gray-200 dark:placeholder-white input dark:bg-gray-600 dark:text-white"></input>

            <label
              className="my-1 mr-2 text-black dark:text-white"
              htmlFor="image">
              Image (Optional)
            </label>
            <input
              type="text"
              name="image"
              id="image"
              placeholder="Enter image url"
              defaultValue={food.image}
              className="w-full max-w-xs text-black placeholder-black bg-gray-200 dark:placeholder-white input dark:bg-gray-600 dark:text-white"></input>

            <label
              className="my-1 mr-2 text-black dark:text-white"
              htmlFor="cheeseomenter">
              Cheeseometer
            </label>
            <select
              className="w-full max-w-xs text-black bg-gray-200 select dark:text-white dark:bg-gray-600"
              name="cheeseometer"
              defaultValue={food.cheeseometer}
              id="cheeseometer">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label
              className="my-1 mr-2 text-black dark:text-white"
              htmlFor="deliverable">
              Deliverable
            </label>
            <select
              className="w-full max-w-xs text-black bg-gray-200 select dark:text-white dark:bg-gray-600"
              name="deliverable"
              defaultValue={food.deliverable ? 'true' : 'false'}
              id="deliverable">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            <label
              className="my-1 mr-2 text-black dark:text-white"
              htmlFor="tags">
              Tags
            </label>
            <input
              type="text"
              required
              name="tags"
              id="tags"
              maxLength={30}
              defaultValue={food.tags || ''}
              placeholder="Enter name"
              className="w-full max-w-xs text-black placeholder-black bg-gray-200 dark:placeholder-white input dark:bg-gray-600 dark:text-white"></input>

            <label
              className="my-1 mr-2 text-black dark:text-white"
              htmlFor="effort">
              Effort
            </label>
            <select
              className="w-full max-w-xs text-black bg-gray-200 select dark:text-white dark:bg-gray-600"
              name="effort"
              defaultValue={food.effort}
              id="effort">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <button
              className="mt-5 text-lg text-gray-100 bg-green-600 border-none rounded-lg ring-green-400 hover:ring-4 hover:bg-green-700 btn"
              type="submit">
              Save food
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateFood;
