import { type FormEvent, Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

interface FormData {
  target: {
    name: { value: string };
    image: { value: string };
    deliverable: { value: string };
    tags: { value: string };
    cheeseometer: { value: string };
    effort: { value: string };
  };
}

const CreateFood = () => {
  const { mutate } = useSWRConfig();
  const [isOpen, setIsOpen] = useState(false);

  async function saveFood(e: FormEvent<HTMLFormElement> & FormData) {
    e.preventDefault();

    const res = await fetch('/api/food/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.name.value,
        image: e.target.image.value,
        deliverable: e.target.deliverable.value === 'true' ? true : false,
        tags: e.target.tags.value,
        cheeseometer: Number(e.target.cheeseometer.value),
        effort: Number(e.target.effort.value),
      }),
    });

    const data = (await res.json()) as { message: string };

    if (res.status !== 200) {
      toast.error(`Failed creating '${e.target.name.value}': ${data.message}`);
      return;
    }

    toast.success(`Created '${e.target.name.value}'`);
    await mutate('/api/food');

    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mx-3 mb-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        Create food
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-700">
                  <Dialog.Title
                    as="h3"
                    className="mb-6 flex justify-between text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                    <div>Create food</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 cursor-pointer">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Dialog.Title>

                  <form
                    className="flex flex-col"
                    onSubmit={(e) =>
                      saveFood(e as FormEvent<HTMLFormElement> & FormData)
                    }>
                    <label
                      className="mb-1 mr-2 mt-2 text-black dark:text-white"
                      htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      id="name"
                      maxLength={30}
                      placeholder="Enter name"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"></input>

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
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"></input>

                    <label
                      className="my-1 mr-2 text-black dark:text-white"
                      htmlFor="cheeseomenter">
                      Cheeseometer
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
                      name="cheeseometer"
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
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
                      name="deliverable"
                      id="deliverable">
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>

                    <label
                      className="my-1 mr-2 text-black dark:text-white"
                      htmlFor="tags">
                      Tags
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
                      name="tags"
                      id="tags">
                      <option value="">-</option>
                      <option value="Veggie">Veggie</option>
                      <option value="Vegan">Vegan</option>
                    </select>

                    <label
                      className="my-1 mr-2 text-black dark:text-white"
                      htmlFor="effort">
                      Effort
                    </label>
                    <select
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
                      name="effort"
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
                      className="btn mt-5 rounded-lg border-none bg-green-600 py-2 text-lg text-gray-100 ring-green-400 hover:bg-green-700 hover:ring-4"
                      type="submit">
                      Save food
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateFood;
