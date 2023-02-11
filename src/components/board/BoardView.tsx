import { useState } from "react";
import CreateBoard from './CreateBoard';
import EmptyBoard from './EmptyBoard';
import { PlusIcon } from '@heroicons/react/20/solid';

export default function BoardView({ boards }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <div className="my-16 flex sm:w-10/12 items-center mx-auto">
                <h1 className="w-full text-4xl font-bold ml-12">
                    Welcome to <span className="text-gradient">your Boards</span>
                </h1>
                <button
                    type="button" onClick={() => setOpen(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 
                    mr-8 px-4 py-1.5 h-fit text-sm font-base text-white shadow-sm 
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Create
                </button>
            </div>
            <div className="mt-8">
                {boards?.length > 0 ? null : <EmptyBoard setOpen={setOpen} />}
                <CreateBoard open={open} setOpen={setOpen} />
            </div>
        </>
    )
}