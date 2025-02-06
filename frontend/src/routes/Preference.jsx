import { useState } from 'react'
import {Card} from 'react-bootstrap'

 const Preference = () => {
   const [selectedItems, setSelectedItems] = useState({
     food: [],
     drink: [],
     play: [],
     etc: [],
     sleep: []
   });
 
   const categories = [
     {
       title: '먹기',
       items: [
         { id: 'korean', icon: '🍚', label: '한식' },
         { id: 'meat', icon: '🥩', label: '고기' },
         { id: 'fish', icon: '🐟', label: '해산물' },
         { id: 'beer', icon: '🍺', label: '맥주' },
         { id: 'cafe', icon: '☕', label: '카페' }
       ]
     },
     {
       title: '마시기',
       items: [
         { id: 'coffee', icon: '☕', label: '커피' },
         { id: 'drink', icon: '🥤', label: '음료수' },
         { id: 'dessert', icon: '🍰', label: '디저트' },
         { id: 'alcohol', icon: '🍺', label: '술' }
       ]
     },
     {
       title: '놀기',
       items: [
         { id: 'cinema', icon: '🎬', label: '영화관' },
         { id: 'karaoke', icon: '🎤', label: '노래방' },
         { id: 'game', icon: '🎮', label: '게임' },
         { id: 'walk', icon: '🚶', label: '산책' }
       ]
     }
   ];
 
   const handleSelect = (category, itemId) => {
     setSelectedItems(prev => ({
       ...prev,
       [category]: prev[category].includes(itemId)
         ? prev[category].filter(id => id !== itemId)
         : [...prev[category], itemId]
     }));
   };
 
   return (
     <div className="min-h-screen bg-gray-50 py-12 px-4">
       <div className="max-w-3xl mx-auto">
         <h1 className="text-3xl font-bold text-center mb-8">당신의 취향을 선택해주세요</h1>
         <p className="text-center text-gray-600 mb-12">관심 있는 항목을 모두 선택해주세요 (복수 선택 가능)</p>
         
         {categories.map((category) => (
           <Card key={category.title} className="mb-8 p-6">
             <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {category.items.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleSelect(category.title, item.id)}
                   className={`p-4 rounded-lg border transition-all ${
                     selectedItems[category.title]?.includes(item.id)
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-200 hover:border-blue-200'
                   }`}
                 >
                   <div className="text-2xl mb-2">{item.icon}</div>
                   <div className="text-sm">{item.label}</div>
                 </button>
               ))}
             </div>
           </Card>
         ))}
 
         <div className="text-center">
           <button
             className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
             onClick={() => console.log('선택된 항목:', selectedItems)}
           >
             선택 완료
           </button>
         </div>
       </div>
     </div>
   );
 };
 
                  
export default Preference;
