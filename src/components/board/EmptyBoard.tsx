import { PlusIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react';
import CreateBoard from './CreateBoard';


export default function EmptyBoard({setOpen}) {

    return (
        <>
            <div
                className="my-16 w-10/12 md:w-6/12 mx-auto relative block w-full rounded-lg border-2 border-dashed border-gray-300 
            p-12 text-center hover:border-gray-400 
            focus:outline-none focus:ring-0 "
            >
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No boards</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new board.</p>
                <div className="mt-6" onClick={() => {
                    console.log(`button clicked!!`)
                    setOpen(true)
                }
                }>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        New Board
                    </button>
                </div>
            </div>
        </>
    )
}
