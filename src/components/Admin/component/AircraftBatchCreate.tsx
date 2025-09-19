const AircraftBatchCreatorEnhanced = () => {
  //   const [aircrafts, setAircrafts] = useState([
  //     { code: "C895", model: "Coeing 895-0", range: 9600 },
  //     { code: "A20N", model: "Airbus A567", range: 9000 },
  //     { code: "A121", model: "Airbus A121", range: 39000 },
  //   ]);

  //   const onDragEnd = (result: any) => {
  //     if (!result.destination) return;

  //     const items = Array.from(aircrafts);
  //     const [reorderedItem] = items.splice(result.source.index, 1);
  //     items.splice(result.destination.index, 0, reorderedItem);

  //     setAircrafts(items);
  //   };

  // ... các hàm add, remove, update giữ nguyên ...

  return (
    // <DragDropContext onDragEnd={onDragEnd}>
    //   <Droppable droppableId="aircrafts">
    //     {(provided) => (
    //       <Box {...provided.droppableProps} ref={provided.innerRef}>
    //         {aircrafts.map((aircraft, index) => (
    //           <Draggable
    //             key={index}
    //             draggableId={index.toString()}
    //             index={index}
    //           >
    //             {(provided) => (
    //               <Paper
    //                 ref={provided.innerRef}
    //                 {...provided.draggableProps}
    //                 sx={{
    //                   p: 2,
    //                   mb: 2,
    //                   display: "flex",
    //                   alignItems: "center",
    //                   gap: 2,
    //                 }}
    //               >
    //                 <Box {...provided.dragHandleProps}>
    //                   <DragHandle />
    //                 </Box>

    //                 <TextField
    //                   label="Code"
    //                   value={aircraft.code}
    //                   //   onChange={(e) =>
    //                   //     updateAircraft(index, "code", e.target.value)
    //                   //   }
    //                   sx={{ flex: 1 }}
    //                 />

    //                 <TextField
    //                   label="Model"
    //                   value={aircraft.model}
    //                   //   onChange={(e) =>
    //                   //     updateAircraft(index, "model", e.target.value)
    //                   //   }
    //                   sx={{ flex: 2 }}
    //                 />

    //                 <TextField
    //                   label="Range"
    //                   type="number"
    //                   value={aircraft.range}
    //                   //   onChange={(e) =>
    //                   //     updateAircraft(index, "range", e.target.value)
    //                   //   }
    //                   sx={{ flex: 1 }}
    //                 />

    //                 <IconButton
    //                   //  onClick={() => removeAircraft(index)}
    //                   color="error"
    //                 >
    //                   <Delete />
    //                 </IconButton>
    //               </Paper>
    //             )}
    //           </Draggable>
    //         ))}
    //         {provided.placeholder}
    //       </Box>
    //     )}
    //   </Droppable>
    // </DragDropContext>
    <></>
  );
};

export default AircraftBatchCreatorEnhanced;
