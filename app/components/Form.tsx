type FormProps = {
  inputLabel: string;
  actionLabel: string;
  submitHandler: (input: string) => void;
};

const slugifyText = (text: string) => text.toLowerCase().replace(/\s/g, "-");

export default function Form({
  inputLabel,
  actionLabel,
  submitHandler,
}: FormProps) {
  const slugifiedLabel = slugifyText(inputLabel);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;

    submitHandler(input.value);

    e.target[0].value = "";
  };

  return (
    <form
      className='flex flex-col items-start gap-2 uppercase'
      onSubmit={(e) => handleFormSubmit(e)}
    >
      <label htmlFor={slugifiedLabel} className='text-sm font-light'>
        {inputLabel}
      </label>
      <input
        type='text'
        id={slugifiedLabel}
        name={slugifiedLabel}
        className='border border-white rounded-md text-white bg-black py-2 px-4 text-2xl uppercase focus:outline-none focus:border-myyellow'
      />
      <button
        type='submit'
        className='bg-black text-white uppercase text-sm py-2 w-full text-left font-light hover:text-myyellow focus:text-myyellow focus:outline-none   focus:border-none'
      >
        {actionLabel} &rarr;
      </button>
    </form>
  );
}
