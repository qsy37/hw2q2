UPDATE cars SET manufacturer='Mazda'
WHERE substr(name, 1, 5) = 'Mazda';

UPDATE cars SET manufacturer='Land Rover'
WHERE substr(name, 1, 4) = 'Land';

.mode csv
.output cars.csv
select manufacturer, avg(msrp), avg(engine_size), avg(horsepower),
		avg(cmpg), avg(hmpg)
from cars
group by manufacturer;

.output stdout