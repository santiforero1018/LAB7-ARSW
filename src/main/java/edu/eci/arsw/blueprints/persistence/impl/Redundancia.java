package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;

import edu.eci.arsw.blueprints.persistence.Filter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

/**
 *
 * @author Juan Sebastian Cepeda Saray
 * @author Santiago Forero Yate
 */
@Service
public class Redundancia implements Filter {

    public Redundancia() {

    }

    @Override
    public List<Point> getPoints(Blueprint pb) {
        List<Point> aux = new ArrayList<>(pb.getPoints());
        int i = 0;
        while (i < aux.size() - 1) {
            if (aux.get(i).getX() == aux.get(i + 1).getX() && aux.get(i).getY() == aux.get(i + 1).getY()) {
                aux.remove(i);
            } else {
                i++;
            }

        }

        return aux;
    }

}
