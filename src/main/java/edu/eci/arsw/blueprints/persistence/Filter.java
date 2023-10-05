package edu.eci.arsw.blueprints.persistence;

import java.util.List;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;

public interface Filter {
    
    public List<Point> getPoints(Blueprint bp);

}
