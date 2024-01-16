export default function PageTitle ({ pageTitle }) {
    return (
        <div className="p-4 border-b-2 border-gray-300">
            <p className="font-semibold text-xl">{pageTitle}</p>
        </div>
    );
}