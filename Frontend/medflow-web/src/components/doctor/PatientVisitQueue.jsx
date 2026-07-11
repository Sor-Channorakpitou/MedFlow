
function PatientVisitQueue({ queue, selectedId, onSelect, onClaim  = () => {} }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full ">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Queue</h3>
        <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-full">
          {queue.length} Remaining
        </span>
      </div>

      <div className="divide-y divide-gray-100 overflow-y-auto">
        {queue.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`p-3.5 text-left cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-teal-50/40 border-l-4 border-teal-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]' 
                  : 'hover:bg-gray-50/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                  item.type === 'IN PROGRESS' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
              </div>
              
              <h4 className="text-xs font-bold text-gray-900 mt-2">{item.name}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{item.reason}</p>

              <button
                  onClick={(e) => { e.stopPropagation(); onClaim(item.id); }}
                  className="mt-2 text-[10px] font-bold bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded-lg transition w-full"
                >
                  Start Consultation
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatientVisitQueue;