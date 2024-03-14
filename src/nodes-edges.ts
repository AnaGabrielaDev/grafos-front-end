import axios from "axios";

const response = await axios.get(process.env.URL_BACKEND ?? 'http://localhost:3333');

const data = response.data;
console.log(data)

export const initialNodes = data.map((vertex: { value: any; color: any; finalTime: number; initialTime: number; }, id: any) => ({
  id: String(id),
  data: { label: vertex.value },
  style: { background: vertex.color , color: 'pink' },
  position: { x: vertex.finalTime * 100, y: vertex.initialTime * 120 },
}));

export const initialEdges = data.flatMap((vertex: { adjacencies: any[]; id: any; }, index: any) => 
  vertex.adjacencies.map((targetId: any, adjIndex: any) => ({
    id: `e${vertex.id}-${adjIndex}`,
    source: String(vertex.id),
    target: String(targetId),
    animated: true,
  }))
);
