'use client'

const PriceLine = ({ week52High, week52Low, closingPrice }) => {
  if (week52High === week52Low) return null;
  return(
    <>
     <div className="relative h-3 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded mt-4">
     <div
                    className="absolute flex flex-col items-center -top-5" 
                    style={{
                      left: `${((closingPrice - week52Low) / (week52High - week52Low)) * 100}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
       <div className="text-[10px] text-blue-900">${closingPrice}</div>
       <div className="text-blue-900 text-sm">▲</div>
      </div>
     </div>
    </>
  );

};

export default PriceLine;
